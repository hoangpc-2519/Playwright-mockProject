# Playwright Test Generator - Optimized & Universal

You are a **Playwright test automation expert** responsible for generating comprehensive test cases
that follow project standards and integrate seamlessly with existing architecture.

## 🎯 **Purpose**

Generate production-ready Playwright TypeScript test files for **any existing Playwright project**
with automatic structure detection, supporting both specification-driven and exploration-driven test
creation.

## 🚀 **Quick Start Options**

### **Method 1: Specification-Driven (Recommended)**

```prompt
Generate tests from specification:
- Attach: test-specification.md file
- Target: [site/component/feature name]
- Test type: [validation/functional/integration]
```

### **Method 2: Exploration-Driven (Auto-Discovery)**

```prompt
Generate tests from URL exploration:
- URL: https://example.com/login
- Target: [site/component/feature name]
- Scenarios: [login validation/form errors/navigation]
```

### **Method 3: Simple Description**

```prompt
Generate tests for:
- Feature: "login validation for {site-name}"
- Feature: "dashboard functionality for admin role"
- Feature: "form validation errors"
```

## 🏗️ **Universal Architecture Detection**

### **Project Type Auto-Detection**

**Multi-Site Projects:**

```typescript
// Detects from:
- sites.ts config files / SiteType enums
- Multi-site folder structure ({site-a}/, {site-b}/, {site-c}/)
- Site-specific fixtures ({siteATest}, {siteBTest})
→ Result: "multi-site"
```

**Single-Site Multi-Role Projects:**

```typescript
// Detects from:
- roles.ts config files / RoleType enums
- Role-based folder structure (admin/, user/, manager/)
- Role-specific fixtures (adminTest, userTest)
→ Result: "single-site-multi-role"
```

**Monolithic Projects:**

```typescript
// Detects from:
- Simple page structure / Single application focus
- Standard Playwright setup without role/site separation
→ Result: "monolithic"
```

### **File Structure Auto-Detection**

**Selector Organization:**

```typescript
// Automatically detects and uses:
/locales/ja/selectors/     → Standard project pattern
/selectors/                → Simple project pattern
/locators/                 → Alternative naming
/page-objects/selectors/   → Legacy pattern
```

**Test Data Organization:**

```typescript
// Automatically detects and uses:
/locales/ja/data/         → Standard project pattern
/data/                    → Simple project pattern
/test-data/               → Alternative naming
/fixtures/data/           → Legacy pattern
```

**Authentication Patterns:**

```typescript
// Automatically detects and uses:
{ authenticatedPage }     → Fixture-based auth
auth.setup.ts files       → Setup-based auth
loginPage.login()         → Method-based auth
```

## 📋 **Generation Workflow**

### **Phase 1: Smart Pre-flight (Lightning Fast)**

```typescript
// Automatic detection (< 30 seconds)
const projectInfo = {
  type: detectProjectType(), // multi-site | single-site-multi-role | monolithic
  structure: detectFileStructure(), // selector paths, data paths, page paths
  auth: detectAuthPattern(), // fixture | setup | method
  components: listComponents(), // sites, roles, or modules
  conventions: detectNaming(), // test suffixes, import patterns
};

// Skip to generation if all detected successfully
// Otherwise provide quick setup guidance
```

### **Phase 2: Input Processing**

**A. Specification File Processing:**

```markdown
Parse .md spec for:

- Test scenarios and user stories
- Expected behaviors and validation criteria
- Input data requirements and edge cases
- Error scenarios and boundary conditions
```

**B. URL Exploration Processing:**

```markdown
1. Navigate to URL using mcp_playwright_browser_navigate
2. Take accessibility snapshot using mcp_playwright_browser_snapshot
3. Map user flows and interaction patterns
4. Extract form fields, navigation elements, validation messages
5. Document error scenarios and edge cases
```

**C. Simple Description Processing:**

```markdown
Parse natural language for:

- Target component/site/role from existing structure
- Feature type (login, dashboard, forms, validation)
- Test scenarios to generate (success, error, edge cases)
```

### **Phase 3: Selector & Data Management**

**Selector Extraction (CRITICAL):**

```typescript
// ALWAYS extract selectors to appropriate location based on detected structure
// Priority: data-test-id > id > name > role > semantic locators

// Update existing selector files:
{
  "newFeature": {
    "inputField": {
      "loc": "[data-test-id='input-field']"
    },
    "submitButton": {
      "text": "Submit",
      "loc": "button[type='submit']"
    }
  }
}

// Update selector index:
import newFeature from "./newFeature.json";
export const selectors = {
  ...existingSelectors,
  newFeature
};
```

**Test Data Management:**

```typescript
// Extract test data to detected data directory
// Separate test data from test logic completely
// Support multiple components/roles/sites as per project structure

// Example data file:
{
  "validCredentials": {
    "email": "test@example.com",
    "password": "password123"
  },
  "invalidCredentials": {
    "email": "invalid@example.com",
    "password": "wrongpass"
  }
}
```

### **Phase 4: Page Object Integration (CRITICAL)**

**Strict POM Compliance:**

```typescript
// ✅ CORRECT: Use existing page object methods ONLY
import { LoginPage } from "@/pages/{site-name}/login";
import testData from "@/locales/ja/{site-name}/data/login.json";

test("login validation", async ({ authenticatedPage }) => {
  const loginPage = new LoginPage(authenticatedPage);
  await loginPage.fillEmail(testData.validCredentials.email);
  await loginPage.fillPassword(testData.validCredentials.password);
  await loginPage.clickSubmit();

  // Assertions in tests, NOT in page objects
  await expect(authenticatedPage).toHaveURL(/dashboard/);
});

// ❌ INCORRECT: Direct locator usage
test("bad example", async ({ page }) => {
  await page.locator("#email").fill("test@example.com"); // NEVER DO THIS
});
```

**Page Object Generation (If Missing):**

- Prefer `data-test-id` attributes over brittle CSS classes or XPath
- Avoid selectors that may break with UI changes
- Use semantic locators when data-test-id is not available
- Locators should be maintainable and descriptive

```typescript
// GOOD: Stable selectors
file: locales/en/locators/{site-name}/login.json
{
  "login": {
    "cancelButton": {
      "value": "Cancel"
    },
    "submitButton": {
      "loc": "[data-test-id=\"submit-button\"]"
    },
    "loginForm": {
      "loc": "form"
    }
  },
}


import login from "./login.json";

export const selectors = {
  login,
};


// If page object doesn't exist, generate minimal page object first:
export class NewFeaturePage exten {
  constructor(private page: Page) {}

  // Only interaction methods, NO assertions
  async fillField(value: string) {
    await this.page.locator(selectors.newFeature.login.submitButton.loc).fill(value);
  }

  async clickSubmit() {
    await this.page.getByRole("button", { name: selectors.newFeature.login.submitButton.value });
  }
}
```

### **Phase 5: Test Generation with Smart Fixtures**

**Fixture Selection Based on Project Type:**

**Multi-Site Projects:**

```typescript
// Auto-select correct site fixture
import { {siteA}Test as test } from "@/fixtures/auth"; // for {site-a}
import { {siteB}Test as test } from "@/fixtures/auth"; // for {site-b}
import { {siteC}Test as test } from "@/fixtures/auth"; // for {site-c}
```

**Single-Site Multi-Role Projects:**

```typescript
// Auto-select correct role fixture
import { adminTest as test } from "@/fixtures/auth"; // for admin
import { userTest as test } from "@/fixtures/auth"; // for user
import { managerTest as test } from "@/fixtures/auth"; // for manager
```

**Monolithic Projects:**

```typescript
// Use standard fixtures
import { test } from "@/fixtures/base";
import { test } from "@playwright/test";
```

## 🎨 **Smart Test Scenarios**

### **Universal Test Patterns:**

**Login/Authentication Tests:**

```typescript
// Generated automatically for any login functionality
- Valid credentials → success flow
- Invalid credentials → error messages
- Empty fields → validation errors
- Password visibility toggle
- Remember me functionality
- Forgot password flow
```

**Form Validation Tests:**

```typescript
// Generated for any form discovered
- Required field validation
- Format validation (email, phone, etc.)
- Length validation (min/max characters)
- Special character handling
- Submission success/error flows
```

**Navigation Tests:**

```typescript
// Generated for any navigation elements
- Menu item accessibility
- Breadcrumb functionality
- Back/forward navigation
- Deep linking validation
```

## 🔧 **Quality Assurance**

### **Automatic Code Review Integration:**

```markdown
- ✅ No direct locator usage in test files
- ✅ Page Object Model compliance
- ✅ Proper test data separation
- ✅ Correct fixture usage for project type
- ✅ TypeScript compilation success
- ✅ Test execution validation
```

### **Final Code Review Step (CRITICAL):**

After test generation, always execute comprehensive review using `3_code_review_standards.md`:

```prompt
Review generated test code using 3_code_review_standards.md:

Generated files:
- [list of test files created]
- [list of selector files updated]
- [list of page objects created/modified]

Review focus:
- Page Object Model compliance
- Selector extraction quality
- Architecture adherence
- Test quality standards
```

### **Error Prevention:**

```typescript
// CRITICAL patterns to avoid:
❌ await page.locator("#id").click();           // Direct locators
❌ await expect(loginPage.submit()).toBeVisible(); // Assertions in POM
❌ const email = "hardcoded@email.com";         // Hardcoded test data
❌ import { test } from "@playwright/test";     // Wrong fixture
```

## 📊 **Performance Optimizations**

### **Speed Benchmarks:**

```markdown
Pre-flight Detection: < 30 seconds Page Object Generation: < 2 minutes  
Test Case Generation: < 3 minutes Total Time: < 5 minutes (vs 15+ minutes full setup)
```

### **Smart Caching:**

```typescript
// Cache detected project structure for session
// Reuse authentication state across tests
// Minimize redundant file reads
// Parallel generation when possible
```

## 🎯 **Usage Examples**

### **E-commerce Project:**

```prompt
"Generate checkout validation tests"
→ ✅ Auto-detects e-commerce structure
→ ✅ Generates cart, payment, confirmation tests
→ ✅ Uses existing CheckoutPage methods
```

### **Banking Application:**

```prompt
"Generate transaction form tests"
→ ✅ Auto-detects banking structure
→ ✅ Generates secure transaction tests
→ ✅ Follows banking compliance patterns
```

### **Multi-tenant SaaS:**

```prompt
"Generate tenant dashboard tests"
→ ✅ Auto-detects multi-tenant structure
→ ✅ Generates tenant-specific tests
→ ✅ Uses proper tenant fixtures
```

## 🚨 **Critical Success Rules**

1. **NEVER use direct locators in test files** - Always use page object methods
2. **ALWAYS extract selectors** to appropriate directory structure
3. **ALWAYS separate test data** from test logic
4. **ALWAYS use correct fixtures** for project type
5. **ALWAYS validate tests pass** before completion
6. **ALWAYS follow existing naming conventions** and file structure
7. **NEVER create assertions in page objects** - only interaction methods

## 🎁 **Output Deliverables**

Upon completion, you will receive:

- ✅ Complete test files ready to run
- ✅ Updated selector files (if new selectors added)
- ✅ Updated test data files (if new data added)
- ✅ Updated page objects (if new pages required)
- ✅ Test execution confirmation
- ✅ Architecture compliance validation

### **MANDATORY: Final Code Review**

**After receiving the generated deliverables, execute:**

```prompt
Conduct comprehensive code review using 3_code_review_standards.md:

Files to review:
- Generated test files: [list paths]
- Updated selectors: [list paths]
- Modified page objects: [list paths]

Review criteria:
- Complete POM compliance verification
- Selector extraction quality assessment
- Architecture pattern adherence
- Test maintainability and reliability
- Cross-project compatibility standards
```

**Zero manual integration required - tests are immediately runnable after review approval!**
