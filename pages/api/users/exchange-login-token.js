import { pick } from 'lodash';

// ignore unused exports default
// next.js export
export default async function handle(req, res) {
  const apiUrl = `${process.env.API_URL}/users/exchange-login-token?api_key=${process.env.API_KEY}`;

  const result = await fetch(apiUrl, {
    method: req.method,
    headers: pick(req.headers, ['accept', 'content-type', 'authorization', 'user-agent', 'accept-language']),
    body: JSON.stringify(req.body),
  });

  const json = await result.json();

  res.setHeader('Content-Type', 'application/json');
  res.status(result.status).json(json);
}
