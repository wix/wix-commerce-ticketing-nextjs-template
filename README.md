### A Wix Events and Wix eCommerce Next.js Music Tour Template

![](docs/media/template-showcase.gif)

This template is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses [Wix Headless](https://dev.wix.com/api/sdk/about-wix-headless/overview) to leverage the Wix Events and Wix Stores business solutions for managing event ticketing and a store.

## Part I: Get started

To integrate the Wix Stores and Wix Events business solutions with the template, first create a project on Wix:

### Step 1: Create a project on Wix

Create a [new Wix Headless project](https://www.wix.com/intro/headless). For instructions on creating a Wix project, see [Create a Wix Headless Project](https://dev.wix.com/api/sdk/sdk-setup:-wix-headless/create-a-project) in the documentation.

When prompted to add functionalities to your new project, select eCommerce and Events:

![Apps Menu - select Bookings and Pricing Plans](docs/media/project-business-solutions.png)

You can also add business solutions to your project later. See [Add Apps to a Project](https://dev.wix.com/api/sdk/guides/add-apps-to-a-project).

### Step 2: Set up the Wix business solutions you need

See [Wix Stores](https://support.wix.com/en/wix-stores) and [Wix Events](https://support.wix.com/en/wix-events) for information on configuring the events and products your business needs.

> ***Note:*** You can add Wix Events and Wix Stores functionality to your project for free, but you must [upgrade to a Business Premium Plan](https://support.wix.com/en/article/wix-stores-upgrading-your-stores-premium-plan) to accept orders and payments.

### Step 3: Authorize the template

There are 2 ways to authorize the template to access your Wix project:

+ [Option A: Quick start deployment](#option-a-quick-start-deployment).
+ [Option B: Create an OAuth client ID in the Wix dashboard](#option-b-create-an-oauth-client-id-in-the-wix-dashboard).

#### Option A: Quick start deployment

Click the quick start deployment link below to automatically authorize your template and configure your project. You'll be prompted to log in to your Wix account and to authorize the platform to access your project or site.

Authentication credentials are automatically incorporated into the template, making it easy to get started coding and customizing.

##### Netlify
[![Netlify Status](https://api.netlify.com/api/v1/badges/77dd7904-ed54-4adf-bd08-023b3f9287d7/deploy-status)](https://app.netlify.com/sites/wix-commerce-ticketing-nextjs-templat/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://manage.wix.com/headless-funnel-nextjs/netlify?repository=https://github.com/wix/wix-commerce-ticketing-nextjs-template)

For more information, see [How to Deploy Next.js Sites to Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/).

You can also view our [live demo site](https://netlify.commerce-ticketing-demo.wix.dev/). In order to view the full flow in the demo site, use the coupon code `FREE` to order products, and use the coupon code `FREETICKET` to "purchase" tickets. This template actively disables reCAPTCHA on direct login.

#### Option B: Create an OAuth client ID in the Wix dashboard

If you don't want to use quick-start deployment, begin by forking this repo to your git account.

Read [Set Up Authorization](https://dev.wix.com/api/sdk/sdk-setup:-wix-headless/authorization) in the Wix SDK documentation for instructions on how to manually create an OAuth app and generate a client ID in the [Headless Settings](https://www.wix.com/my-account/site-selector/?buttonText=Select%20Site&title=Select%20a%20Site&autoSelectOnSingleSite=true&actionUrl=https:%2F%2Fwww.wix.com%2Fdashboard%2F%7B%7BmetaSiteId%7D%7D%2Foauth-apps-settings) menu of the Wix dashboard.

After creating an OAuth app, store the Client ID in a secure location.

> **Note:** Do not push the client ID to your source control.

To set up environment variables for consuming Wix Headless APIs, follow these steps:

##### Local development environment

1. At the terminal, in the template's root folder, type `cp .env.template .env.local`.
2. In the new `.env.local` file, paste the client ID after `NEXT_PUBLIC_WIX_CLIENT_ID=`.

##### Production environment

In your deployment provider, add an environment variable called `NEXT_PUBLIC_WIX_CLIENT_ID` containing the client ID.

## Part II: Local Development

Once you’ve [authorized and configured](#part-i-get-started) your client, run the development server:

```shell
yarn
yarn dev
```

or

```shell
npm i
npm run dev
```

Open http://localhost:3000 with your browser to see the template home page.

You can start editing the homepage by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Similarly, you can edit any other page on the pattern `app/<route>/page.tsx`. For more information, see [Defining Routes](https://beta.nextjs.org/docs/routing/defining-routes) in the Next.js documentation.

## Part III: Checkout and payments

The template implements checkout by redirecting visitors to a Wix-managed page. You can configure your business's checkout in the [eCommerce Settings](https://www.wix.com/my-account/site-selector/?buttonText=Select%20Site&title=Select%20a%20Site&autoSelectOnSingleSite=true&actionUrl=https:%2F%2Fwww.wix.com%2Fdashboard%2F%7B%7BmetaSiteId%7D%7D%2Fstore/settings) menu in the Wix dashboard.

To enable online checkout for the template, follow these steps:

### Step 1: Upgrade to a Business Premium Plan

To enable the checkout page and accept payments using Wix business solutions, you need to [upgrade to a Business Premium Plan](https://support.wix.com/en/article/wix-stores-upgrading-your-stores-premium-plan).

### Step 2: Change the checkout redirect base URL (optional)

To change the base URL for Wix-managed checkout pages, follow these steps in the :
1. In the project [dashboard](https://www.wix.com/my-account/site-selector/?buttonText=Select%20Site&title=Select%20a%20Site&autoSelectOnSingleSite=true&actionUrl=https:%2F%2Fwww.wix.com%2Fdashboard%2F%7B%7BmetaSiteId%7D%7D%2Fhome), click **More Actions**.
2. Click **Rename Project**.
3. Change the editable part of the URL in **Site Address (URL)** and click **Save**.

Alternatively, you can [connect a custom domain](https://dev.wix.com/api/sdk/sdk-setup:-wix-headless/customize-domains).

## Part IV: Learn more about the tech stack

To learn how to customize the template and add more functionality using Wix APIs, see the [Wix JavaScript SDK reference documentation](https://dev.wix.com/api/sdk).

This template is written in [Next.js](https://nextjs.org/docs) 13 using [Next.js app directory](https://beta.nextjs.org/docs/app-directory-roadmap). To learn more about `Next.js`, see the following resources:

+ [Next.js documentation](https://nextjs.org/docs): Learn about Next.js features and APIs.
+ [Learn Next.js](https://nextjs.org/learn): An interactive Next.js tutorial.
+ [Next.js app directory](https://beta.nextjs.org/docs/app-directory-roadmap): Information on the Next.js App Router Roadmap.

Additionally, this template uses the following libraries and features:
+ [React Server Components](https://nextjs.org/docs/advanced-features/react-18/server-components)
+ [TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)
+ [TanStack Query <sup>v4</sup>](https://tanstack.com/query/latest)
+ [Tailwind CSS](https://tailwindcss.com/)
+ [Flowbite](https://flowbite.com/)
+ [Wix client SDK](https://dev.wix.com/api/sdk/introduction)

## Part V: Deployment

You can deploy this repository using any platform which supports Next.js Version 13 and the [App Router Roadmap](https://beta.nextjs.org/docs/app-directory-roadmap).

The repository only requires a single environment variable: `NEXT_PUBLIC_WIX_CLIENT_ID`, which should contain a client ID authorizing access to a Wix project's data.
