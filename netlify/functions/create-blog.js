const fetch = require("node-fetch");

exports.handler = async (event) => {
  const GITHUB_TOKEN = process.env.GIT_HUB;

  const repoOwner = "Abdulhadi446";
  const repoName = "blogs";
  const branch = "main"; // or "master" if you're still on that
  const filePath = "public/index.html";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Guest Blog</title>
</head>
<body>
  <h1>Hello from a Netlify Function</h1>
  <p>This blog was created automatically.</p>
</body>
</html>
  `.trim();

  const githubApi = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  try {
    const createFile = await fetch(githubApi, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: "Create public/index.html via Netlify function",
        content: Buffer.from(htmlContent).toString("base64"),
        branch
      })
    });

    if (!createFile.ok) {
      const error = await createFile.json();
      return {
        statusCode: createFile.status,
        body: JSON.stringify({ error })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "index.html created!" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};