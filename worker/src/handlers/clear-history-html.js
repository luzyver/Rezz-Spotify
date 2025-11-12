/**
 * Clear History HTML Form
 * Returns HTML for password-protected clear history page
 */

export function getClearHistoryHTML() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Clear History</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			background: #0a0e27;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
		}

		.wrapper {
			background: #15192e;
			border: 1px solid #1f2544;
			border-radius: 4px;
			max-width: 420px;
			width: 100%;
			padding: 48px 42px;
		}

		h1 {
			color: #e8eaed;
			font-size: 22px;
			font-weight: 400;
			margin-bottom: 8px;
			letter-spacing: -0.3px;
		}

		.subtitle {
			color: #9aa0a6;
			font-size: 14px;
			margin-bottom: 32px;
			line-height: 1.5;
		}

		.field {
			margin-bottom: 24px;
		}

		label {
			display: block;
			color: #bdc1c6;
			font-size: 13px;
			margin-bottom: 8px;
			font-weight: 400;
		}

		input[type="password"] {
			width: 100%;
			padding: 11px 14px;
			background: #202435;
			border: 1px solid #3c4043;
			border-radius: 3px;
			color: #e8eaed;
			font-size: 15px;
			font-family: inherit;
			transition: border-color 0.2s;
		}

		input[type="password"]:focus {
			outline: none;
			border-color: #8ab4f8;
			background: #1a1d31;
		}

		input[type="password"]::placeholder {
			color: #5f6368;
		}

		.btn {
			width: 100%;
			padding: 12px;
			background: #2d6ff7;
			color: #fff;
			border: none;
			border-radius: 3px;
			font-size: 14px;
			font-weight: 500;
			cursor: pointer;
			transition: background 0.15s;
			font-family: inherit;
		}

		.btn:hover:not(:disabled) {
			background: #4285f4;
		}

		.btn:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		.alert {
			margin-top: 24px;
			padding: 14px 16px;
			border-radius: 3px;
			font-size: 13px;
			line-height: 1.5;
			display: none;
		}

		.alert.success {
			background: rgba(48, 209, 88, 0.1);
			color: #30d158;
			border: 1px solid rgba(48, 209, 88, 0.2);
		}

		.alert.error {
			background: rgba(255, 69, 58, 0.1);
			color: #ff453a;
			border: 1px solid rgba(255, 69, 58, 0.2);
		}

		.spinner {
			display: none;
			margin-top: 16px;
			text-align: center;
			color: #9aa0a6;
			font-size: 13px;
		}

		.spinner::before {
			content: '';
			display: inline-block;
			width: 14px;
			height: 14px;
			margin-right: 8px;
			border: 2px solid #3c4043;
			border-top-color: #8ab4f8;
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
			vertical-align: middle;
		}

		@keyframes spin {
			to { transform: rotate(360deg); }
		}
	</style>
</head>
<body>
	<div class="wrapper">
		<h1>Clear History</h1>
		<p class="subtitle">This action will permanently delete all listening history data.</p>

		<form id="clearForm">
			<div class="field">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					autocomplete="off"
					autofocus>
			</div>

			<button type="submit" class="btn">Clear All History</button>
		</form>

		<div class="spinner" id="loading">Processing</div>
		<div class="alert" id="message"></div>
	</div>

	<script>
		const form = document.getElementById('clearForm');
		const passwordInput = document.getElementById('password');
		const submitBtn = form.querySelector('.btn');
		const loading = document.getElementById('loading');
		const message = document.getElementById('message');

		form.addEventListener('submit', async (e) => {
			e.preventDefault();

			const password = passwordInput.value.trim();
			if (!password) return;

			message.style.display = 'none';
			message.className = 'alert';
			submitBtn.disabled = true;
			loading.style.display = 'block';

			try {
				const res = await fetch('/clear-history?password=' + encodeURIComponent(password), {
					method: 'POST'
				});

				const result = await res.json();

				if (result.success) {
					message.classList.add('success');
					const count = result.itemsRemoved ? ' (' + result.itemsRemoved + ' items)' : '';
					message.textContent = result.message + count;
					passwordInput.value = '';
				} else {
					message.classList.add('error');
					message.textContent = result.error || 'Failed to clear history';
				}
			} catch (err) {
				message.classList.add('error');
				message.textContent = 'Connection error. Please try again.';
			} finally {
				message.style.display = 'block';
				submitBtn.disabled = false;
				loading.style.display = 'none';
			}
		});
	</script>
</body>
</html>`;
}
