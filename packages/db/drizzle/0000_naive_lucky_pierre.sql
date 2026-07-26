CREATE TABLE `fundamental_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stock_id` integer NOT NULL,
	`as_of_date` text NOT NULL,
	`price` real,
	`pe_ratio` real,
	`pb_ratio` real,
	`dividend_yield` real,
	`market_cap` real,
	`eps` real,
	`revenue_growth_yoy` real,
	`debt_to_equity` real,
	`free_cash_flow_yield` real,
	`fetched_at` integer NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fundamental_snapshots_stock_date_idx` ON `fundamental_snapshots` (`stock_id`,`as_of_date`);--> statement-breakpoint
CREATE TABLE `news_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theme_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`source_url` text NOT NULL,
	`model` text DEFAULT 'kimi' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_events_slug_unique` ON `news_events` (`slug`);--> statement-breakpoint
CREATE TABLE `screening_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`run_at` integer NOT NULL,
	`peer_group_by` text DEFAULT 'sector' NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `stock_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`run_id` integer NOT NULL,
	`stock_id` integer NOT NULL,
	`theme_id` integer,
	`valuation_percentile` real,
	`fundamental_score` real,
	`dividend_score` real,
	`entry_signal_score` real,
	`composite_score` real NOT NULL,
	`rank` integer,
	FOREIGN KEY (`run_id`) REFERENCES `screening_runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stock_scores_run_stock_idx` ON `stock_scores` (`run_id`,`stock_id`);--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ticker` text NOT NULL,
	`name` text NOT NULL,
	`exchange` text,
	`sector` text,
	`industry` text,
	`currency` text DEFAULT 'USD' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_ticker_unique` ON `stocks` (`ticker`);--> statement-breakpoint
CREATE TABLE `theme_stocks` (
	`theme_id` integer NOT NULL,
	`stock_id` integer NOT NULL,
	`relevance` real DEFAULT 1 NOT NULL,
	PRIMARY KEY(`theme_id`, `stock_id`),
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `themes_slug_unique` ON `themes` (`slug`);