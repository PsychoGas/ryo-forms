import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  serial,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const forms = pgTable(
  "forms",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    schema: jsonb("schema").notNull(),
    published: boolean("published").default(false).notNull(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull(),
    urlId: text("url_id").notNull().unique(),
  },
  (table) => ({
    slugUrlIdIdx: index("slug_url_id_idx").on(table.slug, table.urlId),
  })
);

export const formResponses = pgTable("form_responses", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  submissionId: text("submission_id").notNull(),
  responseId: integer("response_id")
    .notNull()
    .references(() => formResponses.id, { onDelete: "cascade" }),
});
