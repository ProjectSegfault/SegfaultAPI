import * as dotenv from "dotenv";

dotenv.config();

export const indexTemplate = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			http-equiv="X-UA-Compatible"
			content="IE=edge"
		/>
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<title>SegfaultAPI index</title>
		<link
			rel="stylesheet"
			href="global.css"
		/>
	</head>
	<body>
		<h1>
			Welcome to SegfaultAPI
		</h1>
        <h4>
            Running on port ${process.env.PORT} -
			<a href="https://github.com/ProjectSegfault/SegfaultAPI">GitHub</a>
        </h4>
		<h2>Current APIs:</h2>
		<div class="col">
			<div class="col">
				<h3>Status</h3>
				<a href="/api/v1/status">Status</a>
			</div>
			<div class="col">
				<h3>Form</h3>
				<a href="/api/v1/form">Form (reach via post request)</a>
				<a href="/tools/form">Form example implementation</a>
				<a href="/api/v1/state/form">Form state api</a>
			</div>
			<div class="col">
				<h3>Announcements</h3>
				<a href="/api/v1/announcements">Announcements</a>
				<a href="/api/v1/announcements/post"
					>Post announcement (reach via post request)</a
				>
				<a href="/api/v1/announcements/delete"
					>Delete announcement (reach via post request)</a
				>
				<a href="/tools/announcements"
					>Announcements web configuration tool</a
				>
				<a href="/api/v1/state/announcements"
					>Announcements state api</a
				>
			</div>
		</div>
	</body>
</html>`;

export const cssLiteral = `body {
	padding: 1rem;
	background-color: #171717;
	color: #dddddd;
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	color-scheme: dark;
}

a {
	color: #00d4aa;
	text-decoration: underline;
}

.col {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: fit-content;
}`;

export const formTemplate = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			http-equiv="X-UA-Compatible"
			content="IE=edge"
		/>
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<title>SegfaultAPI form implementation example</title>
		<link
			rel="stylesheet"
			href="../global.css"
		/>
		<script
			src="https://js.hcaptcha.com/1/api.js"
			async
			defer
		></script>
	</head>

	<body>
		<h1><a href="/">Back</a></h1>
		<form
			action="/api/v1/form"
			method="POST"
			class="col"
		>
			<div class="meta">
				<input
					type="text"
					name="email"
					placeholder="Your email"
					required
				/>
				<select
					id="commentType"
					name="commentType"
					required
				>
					<option
						value=""
						selected
						disabled
					>
						Select a type of comment
					</option>
					<option value="Feedback">Feedback</option>
					<option value="Suggestion">Suggestion</option>
					<option value="Question">Question</option>
					<option value="Bug">Bug</option>
				</select>
			</div>
			<textarea
				id="comment"
				name="message"
				rows="4"
				cols="25"
				required
				placeholder="Your message"
			></textarea>
			<div
				class="h-captcha"
				data-sitekey="67e84266-980c-4050-8a39-142a91928fe8"
			></div>
			<input
				type="submit"
				value="Submit"
			/>
		</form>
	</body>
</html>`;

export const announcementsTemplate = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			http-equiv="X-UA-Compatible"
			content="IE=edge"
		/>
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<title>SegfaultAPI announcement command centre</title>
		<link
			rel="stylesheet"
			href="../global.css"
		/>
	</head>

	<body>
		<h1><a href="/">Back</a></h1>
		<div class="col">
			<h1>Post Announcement</h1>
			<form
				action="/api/v1/announcements/post"
				method="POST"
				target="_blank"
				class="col"
			>
				<div class="meta">
					<input
						type="password"
						name="token"
						placeholder="Your authentication token"
						required
					/>
					<br />
					<select
						id="severity"
						name="severity"
						required
					>
						<option
							value=""
							selected
							disabled
						>
							Select severity of announcement
						</option>
						<option value="info">Information announcement</option>
						<option value="low">Low severity</option>
						<option value="medium">Medium severity</option>
						<option value="high">High severity</option>
					</select>
				</div>
				<textarea
					name="title"
					rows="4"
					cols="25"
					required
					placeholder="The announcement text"
				></textarea>
				<br />
				<input
					type="text"
					name="link"
					placeholder="Your link for more details"
				/>
				<input
					type="text"
					name="author"
					placeholder="Your name"
				/>
				<br />
				<button type="submit">Submit</button>
			</form>
			<h1 style="margin-top: 20px">Delete Announcement</h1>
			<form
				action="/api/v1/announcements/delete"
				method="POST"
				target="_blank"
				class="col"
			>
				<div class="meta">
					<input
						type="password"
						name="token"
						placeholder="Your authentication token"
						required
					/>
					<br />
				</div>
				<button type="delete">Delete</button>
			</form>
		</div>
	</body>
</html>`;
