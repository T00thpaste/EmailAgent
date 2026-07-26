function getHeader(headers, name) {
    return (
        headers.find(
            h => h.name.toLowerCase() === name.toLowerCase()
        )?.value || ""
    );
}

function parseEmailAddress(value = "") {
    const match = value.match(/^(.*)<(.+)>$/);

    if (!match) {
        return {
            name: "",
            email: value.trim()
        };
    }

    return {
        name: match[1].trim().replace(/^"|"$/g, ""),
        email: match[2].trim()
    };
}

function parseRecipients(value = "") {
    if (!value) return [];

    return value
        .split(",")
        .map(email => parseEmailAddress(email.trim()));
}

function parseFlags(labelIds = []) {
    return {
        unread: labelIds.includes("UNREAD"),
        starred: labelIds.includes("STARRED"),
        important: labelIds.includes("IMPORTANT")
    };
}

function decodeBody(data = "") {
    return Buffer.from(
        data.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
    )
        .toString("utf-8")
        .replace(/\r\n/g, "\n");
}

function extractPlainText(part) {
    if (!part) {
        return "";
    }

    if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBody(part.body.data);
    }

    if (!part.parts) {
        return "";
    }

    for (const child of part.parts) {
        const text = extractPlainText(child);
        if (text) {
            return text;
        }
    }

    return "";
}

function extractHtml(part) {
    if (!part) {
        return "";
    }

    if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBody(part.body.data);
    }

    if (!part.parts) {
        return "";
    }

    for (const child of part.parts) {
        const html = extractHtml(child);

        if (html) {
            return html;
        }
    }

    return "";
}

function extractAttachments(part) {
    if(!part) {
        return "";
    }

    console.log(part.mimeType, part.filename);
    const attachments = [];

    if(part.filename?.trim()) {
        attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body?.size ?? 0,
            attachmentId: part.body?.attachmentId ?? null
        });
    }

    if(!part.parts) {
        return attachments;
    }

    for(const child of part.parts) {
        const att = extractAttachments(child);
        attachments.push(...att);
    }

    return attachments;
}

export function buildInboxEmail(email) {
    const headers = email.payload.headers;

    const subject = getHeader(headers, "Subject")
    const from = parseEmailAddress(getHeader(headers, "From"));
    const to = parseRecipients(getHeader(headers, "To"));

    const {unread, starred, important} = parseFlags(email.labelIds);

    return {
        id: email.id,
        threadId: email.threadId,

        subject,

        from,
        to,

        date: getHeader(headers, "Date"),

        snippet: email.snippet,

        unread,
        starred,
        important,

        hasAttachments: email.payload.parts?.some(
            part => part.filename && part.filename.length > 0
        ) ?? false
    };
}

export function buildFullEmail(email) {
    const attachments = extractAttachments(email.payload);

    return {
        body: {
            text: extractPlainText(email.payload)//,
            // html: extractHtml(email.payload)
        },

        attachments
    };
}