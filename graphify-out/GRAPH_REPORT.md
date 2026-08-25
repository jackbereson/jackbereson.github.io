# Graph Report - .  (2026-08-25)

## Corpus Check
- Large corpus: 62 files · ~565,305 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 393 nodes · 710 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 87% EXTRACTED · 12% INFERRED · 1% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.85)
- Token cost: 475,984 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Claude Code Project Governance|Claude Code Project Governance]]
- [[_COMMUNITY_Blockchain & Crypto Product Portfolio|Blockchain & Crypto Product Portfolio]]
- [[_COMMUNITY_dev.to Blog Rendering Pipeline|dev.to Blog Rendering Pipeline]]
- [[_COMMUNITY_Career History & Employers|Career History & Employers]]
- [[_COMMUNITY_Legacy Root Build Scripts|Legacy Root Build Scripts]]
- [[_COMMUNITY_Express + MongoDB Blog API|Express + MongoDB Blog API]]
- [[_COMMUNITY_PostHTMLWebpack Dev Toolchain|PostHTML/Webpack Dev Toolchain]]
- [[_COMMUNITY_Brand Icons & Portrait Assets|Brand Icons & Portrait Assets]]
- [[_COMMUNITY_Server Package Dependencies|Server Package Dependencies]]
- [[_COMMUNITY_Legacy Profile Page Components|Legacy Profile Page Components]]
- [[_COMMUNITY_Static Post Prerenderer|Static Post Prerenderer]]
- [[_COMMUNITY_QA Automation & Mapping Tools|QA Automation & Mapping Tools]]
- [[_COMMUNITY_Claude Code Settings & Permissions|Claude Code Settings & Permissions]]
- [[_COMMUNITY_Portfolio Home & Resume UI|Portfolio Home & Resume UI]]
- [[_COMMUNITY_Third-Party RPC Providers|Third-Party RPC Providers]]
- [[_COMMUNITY_Crypto News Helper Module|Crypto News Helper Module]]
- [[_COMMUNITY_Webpack Config Plugins|Webpack Config Plugins]]
- [[_COMMUNITY_Web Manifest Icon Set|Web Manifest Icon Set]]
- [[_COMMUNITY_Cursor Ring Animation|Cursor Ring Animation]]
- [[_COMMUNITY_Typewriter Role Animation|Typewriter Role Animation]]

## God Nodes (most connected - your core abstractions)
1. `dapp.athersphere.com - ICO token + NFT dapp` - 37 edges
2. `dc8.io - NFT launchpad on ETH/Arbitrum` - 30 edges
3. `Le Thanh Vuong (Jack Bereson)` - 29 edges
4. `mystarter.io - ICO/NFT launchpad on BNB` - 28 edges
5. `123lotto.ca - Canadian lottery exchange` - 21 edges
6. `icryptobook.com - cryptocurrency news platform` - 19 edges
7. `pshop.hcmpost.vn - e-commerce website` - 19 edges
8. `k-id.global - e-commerce marketplace (Shopee-like)` - 18 edges
9. `kbgstudio.com - blockchain games marketing site` - 17 edges
10. `scripts` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Pre-render blog posts from dev.to (CI step)` --semantically_similar_to--> `updateMeta (runtime SEO rewrite)`  [INFERRED] [semantically similar]
  .github/workflows/deploy.yml → docs/blog-post.html
- `Dance SVG — floating astronaut 404 / error illustration` --references--> `Jack Bereson Profile Photo (Full Boat Shot)`  [AMBIGUOUS]
  src/images/dance.svg → docs/images/profile.png
- `blog-post.html query-param fetch flow audit` --references--> `Dynamic fallback blog-post.html?id=`  [INFERRED]
  .claude/agents/security-auditor.md → CLAUDE.md
- `Jack Bereson GitHub profile README` --conceptually_related_to--> `jackbereson.github.io project charter`  [AMBIGUOUS]
  README.MD → CLAUDE.md
- `Pre-render blog posts from dev.to (CI step)` --conceptually_related_to--> `data-prerendered short-circuit`  [INFERRED]
  .github/workflows/deploy.yml → docs/blog-post.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Push, watch, and verify the GitHub Pages deploy** — commands_deploy, deploy_skill, claude_deploy_flow, rules_testing_tier3_live_site, deploy_skill_continue_on_error [INFERRED 0.85]
- **Safe card navigation pattern (anchor / data-href over inline onclick)** — rules_code_style_anchor_pattern, rules_code_style_data_href_delegation, rules_code_style_onclick_json_stringify_bug, security_review_skill_onclick_xss_scan, agents_code_reviewer [EXTRACTED 1.00]
- **dev.to content trust boundary (fetch, normalize, render)** — rules_api_conventions_devto_mode, rules_api_conventions_normalizetags, rules_api_conventions_post_shape, security_review_skill_body_html_xss, agents_security_auditor_trust_edges [INFERRED 0.85]
- **Shared nav/footer placeholder injection across all pages** — docs_index_page, docs_blog_page, docs_blog_post_page, docs_games_page, docs_resume_page [EXTRACTED 1.00]
- **dev.to article delivery: CI prerender, manifest lookup, card link, runtime fallback** — workflows_deploy_prerender_step, docs_blog_loadprebuiltmanifest, docs_blog_buildcard, docs_blog_post_init, docs_blog_post_prerendered_guard [EXTRACTED 1.00]
- **Filterable bento card grid pattern (span classes + tab filter + spotlight)** — docs_blog_buildcard, docs_blog_spans, docs_games_rendergames, docs_index_project_filter, docs_index_card_spotlight [INFERRED 0.85]
- **Dark Mode Theming Flow** — components_col_corner_theme_toggle_button, views_index_dark_mode_toggle_script, components_col_main_profile_card, components_head_tailwind_cdn_stylesheet [EXTRACTED 1.00]
- **Responsive Profile Layout Pattern** — views_index_responsive_two_column_shell, components_col_main_profile_card, components_col_img_desktop_profile_sidebar_image, components_col_main_mobile_profile_avatar [INFERRED 0.90]
- **Personal Brand Surface** — components_head_seo_meta_block, components_head_favicon_manifest_set, components_col_main_developer_identity_bio, components_col_main_social_links_row, components_col_main_cv_download_link [INFERRED 0.85]
- **Node/GraphQL/Mongo + React/Next fullstack stack reused across projects** — docs_le_thanh_vuong_js_fullstack_blockchain_tech_nodejs, docs_le_thanh_vuong_js_fullstack_blockchain_tech_graphql, docs_le_thanh_vuong_js_fullstack_blockchain_tech_mongodb, docs_le_thanh_vuong_js_fullstack_blockchain_tech_mongoose, docs_le_thanh_vuong_js_fullstack_blockchain_tech_reactjs, docs_le_thanh_vuong_js_fullstack_blockchain_tech_nextjs, docs_le_thanh_vuong_js_fullstack_blockchain_tech_typescript, docs_le_thanh_vuong_js_fullstack_blockchain_tech_rxjs, docs_le_thanh_vuong_js_fullstack_blockchain_tech_agendajs [EXTRACTED 1.00]
- **Self-hosted VPS delivery pipeline: GitHub Action -> Docker Hub -> Portainer -> Docker Swarm on Ubuntu** — docs_le_thanh_vuong_js_fullstack_blockchain_tech_github_actions, docs_le_thanh_vuong_js_fullstack_blockchain_tech_dockerhub, docs_le_thanh_vuong_js_fullstack_blockchain_tech_portainer, docs_le_thanh_vuong_js_fullstack_blockchain_tech_docker_swarm, docs_le_thanh_vuong_js_fullstack_blockchain_tech_ubuntu18 [EXTRACTED 1.00]
- **Smart-contract toolchain: Solidity authored in Remix/Hardhat, deployed to EVM chains via Web3 injection** — docs_le_thanh_vuong_js_fullstack_blockchain_tech_solidity, docs_le_thanh_vuong_js_fullstack_blockchain_tech_remix, docs_le_thanh_vuong_js_fullstack_blockchain_tech_hardhat, docs_le_thanh_vuong_js_fullstack_blockchain_tech_web3js, docs_le_thanh_vuong_js_fullstack_blockchain_tech_london_vm, docs_le_thanh_vuong_js_fullstack_blockchain_tech_erc20, docs_le_thanh_vuong_js_fullstack_blockchain_tech_erc721, docs_le_thanh_vuong_js_fullstack_blockchain_tech_erc1155 [EXTRACTED 1.00]
- **Cross-Platform Favicon / App Icon Family (Same Portrait Artwork)** — docs_android_chrome_192x192_icon, docs_android_chrome_512x512_icon, docs_apple_touch_icon_image, docs_favicon_16x16_icon, docs_favicon_32x32_icon, docs_mstile_150x150_tile, docs_safari_pinned_tab_mask [INFERRED 0.95]
- **Jack Bereson Personal Identity Imagery** — images_profile_portrait, images_jackbereson_portrait, docs_android_chrome_512x512_icon, docs_apple_touch_icon_image [INFERRED 0.75]
- **Hand-Authored SVG Vector Assets (Illustration + Icon Mask)** — images_dance_astronaut_404, docs_safari_pinned_tab_mask, docs_mstile_150x150_tile [INFERRED 0.55]
- **Legacy src/ favicon + app-icon family (portrait-derived)** — images_favicon_16x16_icon, images_favicon_32x32_icon, images_android_chrome_192x192_icon, images_android_chrome_512x512_icon, images_apple_touch_icon_icon, images_mstile_150x150_tile, images_safari_pinned_tab_mask [INFERRED 0.85]
- **Jack Bereson personal identity portraits** — images_jackbereson_portrait, images_profile_portrait, images_android_chrome_512x512_icon, images_apple_touch_icon_icon [INFERRED 0.75]
- **Legacy src/ brand + illustration artwork (non-icon)** — images_logo_mark, images_dance_illustration, images_profile_portrait, images_jackbereson_portrait [INFERRED 0.65]

## Communities (23 total, 5 thin omitted)

### Community 0 - "Claude Code Project Governance"
Cohesion: 0.06
Nodes (66): code-reviewer agent, Design token drift check, Pragmatic review scope (static site, not enterprise), Relative path assumption check (./ vs ../ under /posts/), security-auditor agent, Meta-tag CSP recommendation for GitHub Pages, blog-post.html query-param fetch flow audit, Narrow threat model (public static site, no auth, no user data) (+58 more)

### Community 1 - "Blockchain & Crypto Product Portfolio"
Cohesion: 0.17
Nodes (50): CI/CD: GitHub Action -> Docker Hub -> Portainer trigger pull, NFT / ICO launchpad pattern (airdrop, listing, buy/sell, admin dashboard), Bcore (crypto exchange startup), 123lotto.ca - Canadian lottery exchange, dapp.athersphere.com - ICO token + NFT dapp, bcash.exchange - crypto exchange, gateway.bcashpay.org - crypto payment gateway, dc8.io - NFT launchpad on ETH/Arbitrum (+42 more)

### Community 2 - "dev.to Blog Rendering Pipeline"
Cohesion: 0.06
Nodes (47): allTags, buildCard (bento card HTML), Card mouse-spotlight handler (blog), catKey, CONFIG (blog list data mode), filter (tag filtering), fmtDate (blog list), init (blog list bootstrap) (+39 more)

### Community 3 - "Career History & Employers"
Cohesion: 0.08
Nodes (45): Akzonobel (outsourcing client), Mitani Sangyo (Japanese parent group), Currently developing crypto products for Vietnamese companies (unnamed), 3-layer architecture model for backend code management, Waterfall project management model (Redmine bug/issue/task tracking), Aureole Information Technology (Mitani Sangyo group, Japan), Bloodland (Korean startup), Freelancer (self-employed, blockchain projects) (+37 more)

### Community 4 - "Legacy Root Build Scripts"
Cohesion: 0.07
Nodes (27): author, dependencies, axios, cssnano, description, license, name, repository (+19 more)

### Community 5 - "Express + MongoDB Blog API"
Cohesion: 0.10
Nodes (16): BlogSchema, mongoose, Blog, express, router, slugify, allowedOrigins, app (+8 more)

### Community 6 - "PostHTML/Webpack Dev Toolchain"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, babel-loader, @babel/preset-env, browser-sync, eslint, eslint-webpack-plugin, htmlnano (+12 more)

### Community 7 - "Brand Icons & Portrait Assets"
Cohesion: 0.14
Nodes (19): Android Chrome Icon 192px (Jack Bereson Portrait), Android Chrome Icon 512px (Jack Bereson Portrait), Apple Touch Icon (Jack Bereson Portrait), Favicon 16px (Jack Bereson Portrait), Favicon 32px (Jack Bereson Portrait), Windows MS Tile 150px (Jack Bereson Portrait), Safari Pinned Tab Monochrome Mask SVG, Android Chrome Icon 192px (Jack portrait crop) (+11 more)

### Community 8 - "Server Package Dependencies"
Cohesion: 0.11
Nodes (17): dependencies, cors, dotenv, express, helmet, mongoose, slugify, description (+9 more)

### Community 9 - "Legacy Profile Page Components"
Cohesion: 0.17
Nodes (15): Theme Toggle Button, Desktop Profile Sidebar Image, CV Download Link, Developer Identity Bio, Mobile Profile Avatar, Profile Card, Social Links Row, SEO Meta Block (+7 more)

### Community 10 - "Static Post Prerenderer"
Cohesion: 0.23
Nodes (14): DOCS, escapeAttr(), escapeHtml(), fmtDate(), fs, main(), normalizeTags(), path (+6 more)

### Community 11 - "QA Automation & Mapping Tools"
Cohesion: 0.17
Nodes (13): Blood.land webgame, PowerEgg autotest suite (1000+ test cases), Replaced Google Map API with Leaflet Map API in the Blood.land webgame, ChromeDriver, Express.js, Git, Google Maps API, Jenkins (+5 more)

### Community 12 - "Claude Code Settings & Permissions"
Cohesion: 0.18
Nodes (10): _doc, env, DEPLOY_WORKFLOW, SITE_URL, includeCoAuthoredBy, model, permissions, allow (+2 more)

### Community 13 - "Portfolio Home & Resume UI"
Cohesion: 0.47
Nodes (6): animateCount (stat count-up), flashBeam (silver beam ambience), Portfolio home page, Résumé design token block, Résumé page, Print media stylesheet

### Community 14 - "Third-Party RPC Providers"
Cohesion: 0.83
Nodes (4): Use third-party RPC providers (GetBlock, Ankr, QuickNode) instead of self-hosted nodes to connect to ETH/Polygon/BSC, Ankr RPC provider, GetBlock RPC provider, QuickNode RPC provider

## Ambiguous Edges - Review These
- `jackbereson.github.io project charter` → `Jack Bereson GitHub profile README`  [AMBIGUOUS]
  README.MD · relation: conceptually_related_to
- `Scratch Debug Widget` → `Responsive Two-Column Shell`  [AMBIGUOUS]
  src/views/components/nha-mai-teo.html · relation: conceptually_related_to
- `Scratch Debug Widget` → `PostHTML Module Composition Root`  [AMBIGUOUS]
  src/views/index.html · relation: references
- `Freelancer (self-employed, blockchain projects)` → `Currently developing crypto products for Vietnamese companies (unnamed)`  [AMBIGUOUS]
  docs/le-thanh-vuong-js-fullstack-blockchain.pdf · relation: conceptually_related_to
- `trfxinternational.com - company website (React + TypeScript)` → `Currently developing crypto products for Vietnamese companies (unnamed)`  [AMBIGUOUS]
  docs/le-thanh-vuong-js-fullstack-blockchain.pdf · relation: conceptually_related_to
- `Android Chrome Icon 512px (Jack Bereson Portrait)` → `Safari Pinned Tab Monochrome Mask SVG`  [AMBIGUOUS]
  docs/safari-pinned-tab.svg · relation: conceptually_related_to
- `Safari Pinned Tab Monochrome Mask SVG` → `Astronaut 404 Error Illustration (dance.svg)`  [AMBIGUOUS]
  docs/images/dance.svg · relation: conceptually_related_to
- `Astronaut 404 Error Illustration (dance.svg)` → `Jack Bereson Profile Photo (Full Boat Shot)`  [AMBIGUOUS]
  docs/images/dance.svg · relation: conceptually_related_to
- `Jack Bereson Profile Photo (Full Boat Shot)` → `Dance SVG — floating astronaut 404 / error illustration`  [AMBIGUOUS]
  src/images/dance.svg · relation: references
- `Site Logo Mark — cyan circuit-trace hexagon monogram` → `Safari Pinned Tab Mask — potrace-vectorized monochrome silhouette`  [AMBIGUOUS]
  src/images/safari-pinned-tab.svg · relation: semantically_similar_to

## Knowledge Gaps
- **133 isolated node(s):** `$schema`, `_doc`, `allow`, `deny`, `SITE_URL` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `jackbereson.github.io project charter` and `Jack Bereson GitHub profile README`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Scratch Debug Widget` and `Responsive Two-Column Shell`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Scratch Debug Widget` and `PostHTML Module Composition Root`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Freelancer (self-employed, blockchain projects)` and `Currently developing crypto products for Vietnamese companies (unnamed)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `trfxinternational.com - company website (React + TypeScript)` and `Currently developing crypto products for Vietnamese companies (unnamed)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Android Chrome Icon 512px (Jack Bereson Portrait)` and `Safari Pinned Tab Monochrome Mask SVG`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Safari Pinned Tab Monochrome Mask SVG` and `Astronaut 404 Error Illustration (dance.svg)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._