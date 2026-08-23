import pool from "../config/database.js";

function toDatabaseValues(email) {
    return [
        email.id,
        email.threadId,
        email.subject,
        email.from.name,
        email.from.email,
        new Date(email.date),
        email.snippet,
        email.body?.plainText ?? null,
        email.body?.html ?? null,
        email.labels ?? [],
        email.attachments?.length > 0
    ];
}

const emailRepository = {
    async getAll() {
        const result = await pool.query(`
            SELECT *
            FROM emails
            ORDER BY received_at DESC
        `);

        return result.rows;
    },

    async saveEmbedding(emailId, embedding) {
        const vector = `[${embedding.join(",")}]`;

        console.log("Saving embedding for:", emailId);
        console.log("Vector length:", embedding.length);

        await pool.query(
            `
            INSERT INTO email_embeddings (
                email_id,
                embedding
            )
            VALUES ($1, $2)
            ON CONFLICT (email_id)
            DO UPDATE SET
                embedding = EXCLUDED.embedding
            `,
            [emailId, vector]
        );
    },

    async searchByEmbedding(embedding, limit = 10) {
        const vector = `[${embedding.join(",")}]`;

        const result = await pool.query(
            `
            SELECT
                e.id,
                e.thread_id,
                e.subject,
                e.sender_name,
                e.sender_email,
                e.received_at,
                e.snippet,
                e.has_attachments,
                1 - (ee.embedding <=> $1::vector) AS similarity
            FROM emails e
            JOIN email_embeddings ee
                ON e.id = ee.email_id
            ORDER BY ee.embedding <=> $1::vector
            LIMIT $2
            `,
            [vector, limit]
        );

        return result.rows;
    },

    async replaceAll(emails, historyId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Upsert instead of delete-then-insert: emails.id cascades to
            // email_embeddings, so wiping the table here would silently
            // destroy every embedding on each restart/re-sync.
            for (const email of emails) {
                await client.query(
                    `
                    INSERT INTO emails (
                        id,
                        thread_id,
                        subject,
                        sender_name,
                        sender_email,
                        received_at,
                        snippet,
                        body_plain_text,
                        body_html,
                        labels,
                        has_attachments
                    )
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10, $11
                    )
                    ON CONFLICT (id) DO UPDATE SET
                        thread_id = EXCLUDED.thread_id,
                        subject = EXCLUDED.subject,
                        sender_name = EXCLUDED.sender_name,
                        sender_email = EXCLUDED.sender_email,
                        received_at = EXCLUDED.received_at,
                        snippet = EXCLUDED.snippet,
                        body_plain_text = EXCLUDED.body_plain_text,
                        body_html = EXCLUDED.body_html,
                        labels = EXCLUDED.labels,
                        has_attachments = EXCLUDED.has_attachments
                    `,
                    toDatabaseValues(email)
                );
            }

            await client.query(
                `
                INSERT INTO sync_state (
                    id,
                    latest_history_id
                )
                VALUES (1, $1)
                ON CONFLICT (id)
                DO UPDATE SET
                    latest_history_id = EXCLUDED.latest_history_id,
                    updated_at = NOW()
                `,
                [historyId]
            );

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async addEmail(email) {
        const values = toDatabaseValues(email);
        await pool.query(
            `
            INSERT INTO emails (
                id,
                thread_id,
                subject,
                sender_name,
                sender_email,
                received_at,
                snippet,
                body_plain_text,
                body_html,
                labels,
                has_attachments
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11
            )
            ON CONFLICT (id) DO NOTHING
            `,
            values
        );
    },

    async getLatestHistoryId() {
        const result = await pool.query(`
            SELECT latest_history_id
            FROM sync_state
            WHERE id = 1
        `);

        return result.rows[0]?.latest_history_id ?? null;
    },

    async setLatestHistoryId(id) {
        await pool.query(`
            INSERT INTO sync_state (id, latest_history_id)
            VALUES (1, $1)
            ON CONFLICT (id)
            DO UPDATE SET
                latest_history_id = EXCLUDED.latest_history_id,
                updated_at = NOW()
        `, [id]);
    },

    async isInitialized() {
        const historyId = await this.getLatestHistoryId();
        return historyId !== null;
    }
};

export default emailRepository;