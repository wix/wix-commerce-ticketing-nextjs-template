async function main() {
  if (
    !process.env.VERCEL &&
    !process.env.DEBUG &&
    !process.env.NETLIFY &&
    !process.env.NEXT_PUBLIC_WIX_CLIENT_ID
  ) {
    return;
  }
  const provider = process.env.VERCEL ? 'vercel' : 'netlify';

  await fetch(
    `https://manage.wix.com/headless-funnel-nextjs/api/captcha/disable?refreshToken=${process.env.WIX_REFRESH_TOKEN}&state={"provider":"${provider}"}&clientId=${process.env.NEXT_PUBLIC_WIX_CLIENT_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

main();
