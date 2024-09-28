const {
  test,
  expect,
  beforeEach,
  describe,
  afterEach,
} = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");

    await page.context().clearCookies();
    await page.context().clearPermissions();

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      },
    });

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Another User",
        username: "anotheruser",
        password: "password456",
      }
    });

    await page.goto("http://localhost:5173");
    await page.getByRole("button", { name: "login" }).click();
  });

  test("Login form is displayed with required fields and buttons", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();

    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "cancel" })).toBeVisible();
  });

  describe("Login", () => {
    test("Successful login with correct credentials", async ({ page }) => {
      await page.getByPlaceholder("Username").fill("johndoe");
      await page.getByPlaceholder("Password").fill("password123");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("John Doe logged in")).toBeVisible();
      await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

      await page.getByRole("button", { name: "Logout" }).click();
    });

    test("Login fails with incorrect password", async ({ page }) => {
      await page.getByPlaceholder("Username").fill("johndoe");
      await page.getByPlaceholder("Password").fill("wrongpassword");

      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("Incorrect username or password")
      ).toBeVisible();

      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await page.getByPlaceholder("Username").fill("johndoe");
        await page.getByPlaceholder("Password").fill("password123");
        await page.getByRole("button", { name: "login" }).click();
      });

      afterEach(async ({ page }) => {
        await page.evaluate(() => localStorage.clear());
        await page.context().clearCookies();
        await page.getByRole("button", { name: "Logout" }).click();
        await expect(page.getByRole("button", { name: "login" })).toBeVisible();
      });

      test("a new blog can be created", async ({ page }) => {
        await page.getByRole("button", { name: "Create New Blog" }).click();
        await page.getByPlaceholder("Title").fill("Test Blog");
        await page.getByPlaceholder("Author").fill("Test Author");
        await page.getByPlaceholder("Url").fill("http://testblog.com");
        await page.getByRole("button", { name: "Create" }).click();

        await expect(page.getByText("Test Blog")).toBeVisible();
        await expect(page.getByText("Test Author")).toBeVisible();
      });

      test("the like button works", async ({ page }) => {
        await page.getByRole("button", { name: "Create New Blog" }).click();
        await page.getByPlaceholder("Title").fill("Test Blog");
        await page.getByPlaceholder("Author").fill("Test Author");
        await page.getByPlaceholder("Url").fill("http://testblog.com");
        await page.getByRole("button", { name: "Create" }).click();

        await page.getByRole("button", { name: "View" }).click();

        const likesBefore = await page
          .locator('[data-testid="like-count"]')
          .innerText();

        const likesBeforeNumber = Number(likesBefore.trim());

        await page.getByRole("button", { name: "Like" }).click();

        await page.waitForFunction((likesBefore) => {
          const likesAfter = document
            .querySelector('[data-testid="like-count"]')
            .innerText.trim();
          return Number(likesAfter) === Number(likesBefore) + 1;
        }, likesBeforeNumber);

        const likesAfter = await page
          .locator('[data-testid="like-count"]')
          .innerText();

        const likesAfterNumber = Number(likesAfter.trim());

        expect(likesAfterNumber).toBe(likesBeforeNumber + 1);
      });

      test("a blog can be deleted", async ({ page }) => {
        await page.getByRole("button", { name: "Create New Blog" }).click();
        
        await page.getByPlaceholder("Title").fill("Test Blog");
        await page.getByPlaceholder("Author").fill("Test Author");
        await page.getByPlaceholder("Url").fill("http://testblog.com");
        await page.getByRole("button", { name: "Create" }).click();
    
        await page.waitForSelector('text=Test Blog');
        await expect(page.getByText("Test Blog")).toBeVisible();
        await expect(page.getByText("Test Author")).toBeVisible();
        
        await page.getByRole("button", { name: "View" }).click();
    
        await page.waitForSelector('button:has-text("Remove")');
    
        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });
    
        await page.getByRole("button", { name: "Remove" }).click();
    
        await expect(page.getByText("Test Blog")).not.toBeVisible();
    });

    test('only the blog creator sees the remove button', async ({ page }) => {
      
      await page.getByRole('button', { name: 'Create New Blog' }).click();
      await page.getByPlaceholder('Title').fill('Johns Blog');
      await page.getByPlaceholder('Author').fill('John Doe');
      await page.getByPlaceholder('Url').fill('http://johnsblog.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await page.getByRole('button', { name: 'view' }).click();
      const removeButtonVisibleUser1 = await page.locator('button:has-text("Remove")').isVisible();
      expect(removeButtonVisibleUser1).toBeTruthy();
  
      await page.getByRole('button', { name: 'Logout' }).click();
  
      await page.getByRole("button", { name: "login" }).click();

      await page.getByPlaceholder('Username').fill('anotheruser');
      await page.getByPlaceholder('Password').fill('password456');
      await page.getByRole('button', { name: 'login' }).click();
  
      await page.getByRole('button', { name: 'view' }).click();
      const removeButtonVisible = await page.locator('button:has-text("Remove")').isVisible();
      expect(removeButtonVisible).toBeFalsy();
  
    });

    test('blogs are sorted by the number of likes', async ({ page }) => {

      await page.getByRole('button', { name: 'Create New Blog' }).click();
      await page.getByPlaceholder('Title').fill('First Blog');
      await page.getByPlaceholder('Author').fill('Author One');
      await page.getByPlaceholder('Url').fill('http://firstblog.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await page.waitForTimeout(500);

      
      await page.getByPlaceholder('Title').fill('Second Blog');
      await page.getByPlaceholder('Author').fill('Author Two');
      await page.getByPlaceholder('Url').fill('http://secondblog.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await page.waitForTimeout(500);

      
      await page.getByPlaceholder('Title').fill('Third Blog');
      await page.getByPlaceholder('Author').fill('Author Three');
      await page.getByPlaceholder('Url').fill('http://thirdblog.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await page.waitForTimeout(500);
    
      await page.waitForSelector('.blog'); 
    
      await page.locator(`button[data-testid="view-First Blog"]`).click(); 
      for (let i = 0; i < 3; i++) {
        await page.locator(`button[data-testid="like-First Blog"]`).click(); 
      }
    
      await page.locator(`button[data-testid="view-Second Blog"]`).click(); 
      for (let i = 0; i < 5; i++) {
        await page.locator(`button[data-testid="like-Second Blog"]`).click(); 
      }
    
      await page.locator(`button[data-testid="view-Third Blog"]`).click();
      await page.locator(`button[data-testid="like-Third Blog"]`).click(); 
    
      const blogTitles = await page.$$eval('.blog', blogs => blogs.map(blog => blog.textContent));
    
      expect(blogTitles[0]).toContain('Second Blog'); 
      expect(blogTitles[1]).toContain('First Blog');
      expect(blogTitles[2]).toContain('Third Blog'); 
    });
    });
  });
});
