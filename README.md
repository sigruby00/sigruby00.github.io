# sigruby00.github.io

개인 웹사이트입니다. Jekyll과 Minima 테마를 사용하여 구축되었습니다.

## 새로운 페이지 추가하는 방법 (How to Add New Pages)

### 방법 1: 루트 디렉토리에 마크다운 파일 추가

새로운 페이지를 추가하려면, 프로젝트의 루트 디렉토리에 `.md` 파일을 생성하면 됩니다.

**예시:** `about.md`, `contact.md`, `projects.md` 등

각 파일의 상단에는 다음과 같은 front matter를 포함해야 합니다:

```markdown
---
layout: page
title: 페이지 제목
permalink: /url-경로/
---

# 페이지 내용

여기에 마크다운 형식으로 내용을 작성합니다.
```

### 방법 2: 하위 디렉토리 사용

더 복잡한 구조가 필요한 경우, 디렉토리를 만들고 그 안에 `index.md` 파일을 생성할 수 있습니다:

```
portfolio/
  index.md
blog/
  index.md
```

### Front Matter 설명

- `layout`: 사용할 레이아웃 (보통 `page` 또는 `post`)
- `title`: 페이지 제목
- `permalink`: 페이지의 URL 경로 (예: `/about/`, `/contact/`)

### 예시 파일

이 저장소에는 `about.md` 예시 파일이 포함되어 있습니다. 이 파일을 참고하여 새로운 페이지를 만들 수 있습니다.

## 로컬에서 테스트하기

```bash
bundle install
bundle exec jekyll serve
```

그런 다음 브라우저에서 `http://localhost:4000`을 열어 사이트를 확인할 수 있습니다.

---

## How to Add New Pages (English)

### Method 1: Add Markdown Files to Root Directory

To add a new page, simply create a `.md` file in the root directory of the project.

**Examples:** `about.md`, `contact.md`, `projects.md`, etc.

Each file should include front matter at the top:

```markdown
---
layout: page
title: Your Page Title
permalink: /your-url-path/
---

# Page Content

Write your content here in markdown format.
```

### Method 2: Use Subdirectories

For more complex structures, create directories with `index.md` files:

```
portfolio/
  index.md
blog/
  index.md
```

### Front Matter Explanation

- `layout`: The layout to use (typically `page` or `post`)
- `title`: The page title
- `permalink`: The URL path for the page (e.g., `/about/`, `/contact/`)

### Example File

This repository includes an example `about.md` file. You can reference this file when creating new pages.

## Testing Locally

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000` in your browser to view the site.