CREATE TABLE `t3-apexo_chat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`name` text(256),
	`thread_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `t3-apexo_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `t3-apexo_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`clerk_id` integer,
	`stripe_id` text(256),
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `chat_name_idx` ON `t3-apexo_chat` (`name`);--> statement-breakpoint
CREATE INDEX `chat_thread_idx` ON `t3-apexo_chat` (`thread_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `t3-apexo_post` (`name`);--> statement-breakpoint
CREATE INDEX `user_name_idx` ON `t3-apexo_user` (`name`);