# 📚 Hướng Dẫn Chi Tiết - Dự Án Angular + Express + MongoDB

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Những Lỗi Gặp Phải](#những-lỗi-gặp-phải)
3. [Giải Pháp & Thay Đổi](#giải-pháp--thay-đổi)
4. [Chi Tiết Từng Thay Đổi](#chi-tiết-từng-thay-đổi)
5. [Cách Hoạt Động](#cách-hoạt-động)
6. [Hướng Dẫn Chạy](#hướng-dẫn-chạy)

---

## 🎯 Tổng Quan

Dự án này là một ứng dụng web full-stack gồm:

- **Frontend**: Angular 20 (localhost:4200) - Standalone Components
- **Backend**: Express.js + Node.js (localhost:3000) - REST API
- **Database**: MongoDB - Lưu trữ dữ liệu sản phẩm

**Mục tiêu**: Khi user click nút "Get Product" trong frontend, sẽ gọi API backend để lấy danh sách sản phẩm từ MongoDB và hiển thị lên UI.

---

## ❌ Những Lỗi Gặp Phải

### Lỗi 1: Bootstrap không được load

```
[ERROR] Could not resolve "src/assets/bootstrap/css/bootstrap.min.css"
[ERROR] Could not resolve "node_modules/bootstrap/dist/js/bootstrap.min.js"
```

**Nguyên nhân**:

- File CSS trỏ tới `src/assets/bootstrap/css/bootstrap.min.css` (không tồn tại)
- Package.json có lỗi chính tả: "boostrap" thay vì "bootstrap"

### Lỗi 2: Frontend không thể gọi Backend

```
CORS error hoặc no response from localhost:3000
```

**Nguyên nhân**: Backend chưa enable CORS

### Lỗi 3: Service injection error

```
[ERROR] NG0201: No provider found for `HttpClient`
```

**Nguyên nhân**: HttpClient provider chưa được đăng ký

### Lỗi 4: Router warning

```
[WARNING] NG8113: RouterOutlet is not used within the template of App
```

**Nguyên nhân**: RouterOutlet được import nhưng không sử dụng trong template

---

## ✅ Giải Pháp & Thay Đổi

Dưới đây là 9 thay đổi chính đã được thực hiện:

| #   | File                                    | Vấn Đề                   | Giải Pháp                           |
| --- | --------------------------------------- | ------------------------ | ----------------------------------- |
| 1   | `my-client/package.json`                | Typo "boostrap"          | Sửa thành "bootstrap": "^5.3.0"     |
| 2   | `my-client/angular.json`                | Đường dẫn CSS/JS sai     | Trỏ tới node_modules/bootstrap/dist |
| 3   | `my_server/index.js`                    | CORS không enable        | Thêm `app.use(cors())`              |
| 4   | `my-client/src/app/services/product.ts` | Service chưa có          | Tạo service gọi API                 |
| 5   | `my-client/src/app/test/test.ts`        | Component trống          | Thêm logic + signals                |
| 6   | `my-client/src/app/test/test.html`      | Template tĩnh            | Thêm dynamic binding                |
| 7   | `my-client/src/app/app.config.ts`       | HttpClient không provide | Thêm `provideHttpClient()`          |
| 8   | `my-client/src/app/app.ts`              | HttpClientModule sai     | Loại bỏ, dùng provider              |
| 9   | `my-client/src/app/app.html`            | RouterOutlet không dùng  | Thêm `<router-outlet>`              |

---

## 🔧 Chi Tiết Từng Thay Đổi

### 1️⃣ FIX BOOTSTRAP TYPO (package.json)

**📍 File**: `my-client/package.json`

**Trước:**

```json
{
  "dependencies": {
    "@angular/common": "^20.3.0",
    "@angular/compiler": "^20.3.0",
    "@angular/core": "^20.3.0",
    "@angular/forms": "^20.3.0",
    "@angular/platform-browser": "^20.3.0",
    "@angular/router": "^20.3.0",
    "boostrap": "^2.0.0",  ❌ TYPO: "boostrap" thay vì "bootstrap"
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  }
}
```

**Sau:**

```json
{
  "dependencies": {
    "@angular/common": "^20.3.0",
    "@angular/compiler": "^20.3.0",
    "@angular/core": "^20.3.0",
    "@angular/forms": "^20.3.0",
    "@angular/platform-browser": "^20.3.0",
    "@angular/router": "^20.3.0",
    "bootstrap": "^5.3.0",  ✅ Sửa chính tả, cập nhật lên phiên bản mới
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  }
}
```

**Giải Thích Chi Tiết:**

- **Typo**: npm tìm kiếm package tên "boostrap" trên registry, nhưng package này không tồn tại (chỉ có "bootstrap")
- **Phiên bản**: Bootstrap 5.3.0 là phiên bản mới nhất, hỗ trợ tốt với Angular 20
- **Kết quả**: Sau khi sửa, chạy `npm install` sẽ tải đúng package bootstrap từ npm registry

---

### 2️⃣ CẬP NHẬT BOOTSTRAP PATHS (angular.json)

**📍 File**: `my-client/angular.json`

**Trước:**

```json
{
  "projects": {
    "my-client": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "src/assets/bootstrap/css/bootstrap.min.css"  ❌ File không tồn tại
            ],
            "scripts": ["node_modules/bootstrap/dist/js/bootstrap.min.js"]  ⚠️ Thiếu Popper
          }
        },
        "test": {
          "options": {
            "styles": [
              "src/styles.css",
              "src/assets/bootstrap/css/bootstrap.min.css"  ❌ File không tồn tại
            ]
          }
        }
      }
    }
  }
}
```

**Sau:**

```json
{
  "projects": {
    "my-client": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "node_modules/bootstrap/dist/css/bootstrap.min.css"  ✅ File có sẵn từ npm
            ],
            "scripts": ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"]  ✅ Bao gồm Popper
          }
        },
        "test": {
          "options": {
            "styles": [
              "src/styles.css",
              "node_modules/bootstrap/dist/css/bootstrap.min.css"  ✅ File có sẵn
            ]
          }
        }
      }
    }
  }
}
```

**Giải Thích Chi Tiết:**

| Yếu Tố        | Trước                                        | Sau                                                 | Lý Do                                                                                                     |
| ------------- | -------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **CSS Path**  | `src/assets/bootstrap/css/bootstrap.min.css` | `node_modules/bootstrap/dist/css/bootstrap.min.css` | Bootstrap không được copy vào `src/assets`, nên lấy trực tiếp từ `node_modules` (nơi npm cài đặt)         |
| **JS Bundle** | `bootstrap.min.js`                           | `bootstrap.bundle.min.js`                           | Bundle version bao gồm Popper.js (cần cho dropdown, tooltip, popover). Min version chỉ có Bootstrap code. |

**Cách hoạt động:**

1. Khi chạy `ng build` hoặc `ng serve`, Angular CLI đọc `angular.json`
2. CSS file được extract vào final bundle
3. JS file được thêm vào `<script>` tag tự động
4. Trình duyệt load file này khi page khởi động

---

### 3️⃣ ENABLE CORS Ở BACKEND (index.js)

**📍 File**: `my_server/index.js`

**Trước:**

```javascript
const express = require("express");
const app = express();
const port = 3000;

//Connect to MongoDB
const db = require("./config/db");
db.connect();

// localhost:3000/127.0.0.1 => "Hello"
app.get("/", (req, res) => {
  res.send("Hello");
});

// localhost:3000/products => product list
app.get("/products", (req, res) => {
  res.send([
    { productCode: 1, productName: "Heineken", productPrice: 19000 },
    { productCode: 2, productName: "Tiger", productPrice: 18000 },
    { productCode: 3, productName: "Sapporo", productPrice: 21000 },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening port ${port}`);
});
```

**Sau:**

```javascript
const express = require("express");
const cors = require("cors"); // ✅ Import CORS package
const app = express();
const port = 3000;

// Enable CORS  ✅ Thêm middleware
app.use(cors());

//Connect to MongoDB
const db = require("./config/db");
db.connect();

// localhost:3000/127.0.0.1 => "Hello"
app.get("/", (req, res) => {
  res.send("Hello");
});

// localhost:3000/products => product list
app.get("/products", (req, res) => {
  res.send([
    { productCode: 1, productName: "Heineken", productPrice: 19000 },
    { productCode: 2, productName: "Tiger", productPrice: 18000 },
    { productCode: 3, productName: "Sapporo", productPrice: 21000 },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening port ${port}`);
});
```

**Giải Thích Chi Tiết - CORS là gì?**

```
Scenario 1: Không có CORS
─────────────────────────
Frontend (localhost:4200) → Request → Backend (localhost:3000)
                                           ↓
                                      Browser Intercept
                                      "KHÔNG cho phép!"
                                      (vì khác port)
                                           ↓
                                    CORS Error ❌

Scenario 2: Có CORS
──────────────────
Frontend (localhost:4200) → Request → Backend (localhost:3000)
                                           ↓
                                    CORS Middleware
                                    "OK, cho phép"
                                    (Add CORS headers)
                                           ↓
                                   Response ✅
```

**Cách hoạt động chi tiết:**

1. Browser gửi HTTP request từ `localhost:4200` tới `localhost:3000`
2. Browser nhìn thấy request tới khác origin (khác protocol, domain hoặc port)
3. Trước khi gửi, browser kiểm tra response header `Access-Control-Allow-Origin`
4. `app.use(cors())` tự động thêm header: `Access-Control-Allow-Origin: *`
5. Browser thấy header này, cho phép request → ✅ Thành công

---

### 4️⃣ TẠO PRODUCT SERVICE (product.ts)

**📍 File**: `my-client/src/app/services/product.ts` (File mới)

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// ✅ Interface định nghĩa cấu trúc dữ liệu Product
export interface Product {
  productCode: number;
  productName: string;
  productPrice: number;
}

// ✅ Injectable decorator - đánh dấu class này là service
// providedIn: 'root' = service được register ở level app, singleton pattern
@Injectable({
  providedIn: "root",
})
export class ProductService {
  // ✅ API endpoint của backend
  private apiUrl = "http://localhost:3000/products";

  // ✅ Inject HttpClient để gọi API
  constructor(private http: HttpClient) {}

  // ✅ Hàm gọi API GET, trả về Observable
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

**Giải Thích Chi Tiết:**

**1. Interface Product:**

```typescript
export interface Product {
  productCode: number; // ID sản phẩm
  productName: string; // Tên sản phẩm
  productPrice: number; // Giá tiền
}
```

- **Mục đích**: TypeScript interface định nghĩa kiểu dữ liệu
- **Lợi ích**:
  - IDE tự động hoàn thành khi code (IntelliSense)
  - Compiler check type tại compile time, tránh lỗi runtime
  - Documentation tự động

**2. @Injectable decorator:**

```typescript
@Injectable({
  providedIn: "root", // ✅ Singleton - 1 instance dùng chung toàn app
})
export class ProductService {}
```

- **providedIn: 'root'**: Dùng Dependency Injection ở root level
- **Singleton pattern**: Angular tạo 1 instance ProductService duy nhất cho toàn app
- **Nếu không có**: `No provider found for ProductService` error

**Alternatives:**

```typescript
// Cách cũ (NgModule)
@NgModule({
  providers: [ProductService]  // Register trong module
})

// Cách mới (Standalone)
@Injectable({ providedIn: 'root' })  // ✅ Dùng cách này
```

**3. HttpClient:**

```typescript
constructor(private http: HttpClient) { }
```

- **private http**: Dependency Injection - Angular tự động cung cấp HttpClient
- **HttpClient methods**:
  - `.get(url)` - GET request
  - `.post(url, body)` - POST request
  - `.put(url, body)` - PUT request
  - `.delete(url)` - DELETE request
  - `.patch(url, body)` - PATCH request

**4. getProducts() method:**

```typescript
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.apiUrl);
}
```

- **Observable**: Mô hình Reactive (RxJS)
  - Giống Promise nhưng có thêm tính năng: cancel, retry, pipe operators...
  - `<Product[]>`: Type casting - kết quả là array các Product
- **Lợi ích Observable vs Promise**:

| Observable                    | Promise           |
| ----------------------------- | ----------------- |
| Lazy (gọi khi subscribe)      | Eager (chạy ngay) |
| Có thể hủy (unsubscribe)      | Không hủy được    |
| Có operators (map, filter...) | Chỉ có then/catch |
| Streaming data                | Single value      |

---

### 5️⃣ CẬP NHẬT TEST COMPONENT (test.ts)

**📍 File**: `my-client/src/app/test/test.ts`

**Trước:**

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-test",
  imports: [], // ❌ Không import gì
  templateUrl: "./test.html",
  styleUrl: "./test.css",
})
export class Test {
  // ❌ Trống, không có logic
}
```

**Sau:**

```typescript
import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductService, Product } from "../services/product";

@Component({
  selector: "app-test",
  imports: [CommonModule], // ✅ CommonModule cho *ngIf, *ngFor
  templateUrl: "./test.html",
  styleUrl: "./test.css",
})
export class Test {
  // ✅ 3 Signals quản lý state của component
  products = signal<Product[]>([]); // Mảng sản phẩm từ API
  loading = signal(false); // Trạng thái đang load
  error = signal<string | null>(null); // Thông báo lỗi

  // ✅ Inject ProductService
  constructor(private productService: ProductService) {}

  // ✅ Hàm xử lý khi click nút "Get Product"
  getProducts() {
    this.loading.set(true); // Bật loading
    this.error.set(null); // Reset error

    this.productService.getProducts().subscribe({
      // ✅ next: Khi API trả về kết quả thành công
      next: (data: Product[]) => {
        this.products.set(data); // Cập nhật products signal
        this.loading.set(false); // Tắt loading
      },
      // ✅ error: Khi API gặp lỗi
      error: (err: any) => {
        this.error.set("Failed to load products"); // Set error message
        console.error(err); // Log lỗi để debug
        this.loading.set(false); // Tắt loading
      },
    });
  }
}
```

**Giải Thích Chi Tiết:**

**1. Signals - Angular 16+ Feature:**

```typescript
products = signal<Product[]>([]);
```

**Signal là gì?**

- Công nghệ mới trong Angular để quản lý reactive state
- Tương tự React useState nhưng tích hợp sâu vào Angular
- Khi Signal thay đổi → Template tự động re-render

**Trước đây (RxJS):**

```typescript
products$ = new BehaviorSubject<Product[]>([]);
// Template: *ngIf="products$ | async as products"
```

**Bây giờ (Signal):**

```typescript
products = signal<Product[]>([]);
// Template: *ngIf="products().length > 0"  // Gọn hơn
```

**3 Signals trong component:**

```typescript
products = signal<Product[]>([]); // Array rỗng ban đầu
loading = signal(false); // Tắt loading ban đầu
error = signal<string | null>(null); // Không có lỗi ban đầu
```

**2. Dependency Injection:**

```typescript
constructor(private productService: ProductService) { }
```

- **private productService**: Khai báo property
- Angular tự động cung cấp instance ProductService
- Có thể dùng `this.productService` ở bất kỳ đâu trong component

**3. Subscribe Pattern:**

```typescript
this.productService.getProducts().subscribe({
  next: (data: Product[]) => {
    /* Thành công */
  },
  error: (err: any) => {
    /* Lỗi */
  },
  complete: () => {
    /* Xong */
  }, // Optional
});
```

**Timeline khi user click nút:**

```
Timeline:
─────────────────────────────────────────
T0: User click nút
    ↓
T1: getProducts() được gọi
    loading.set(true)     → Show "Loading..."
    error.set(null)       → Clear error
    ↓
T2: HttpClient gửi GET request tới http://localhost:3000/products
    ↓
T3: Browser check CORS
    ↓
T4: Backend Express nhận request
    ↓
T5: Backend trả về JSON array
    ↓
T6: Frontend nhận response
    subscribe.next() được gọi
    ↓
T7: products.set(data)  → Update signal
    loading.set(false)   → Hide "Loading..."
    ↓
T8: Template re-render
    ↓
T9: UI hiển thị danh sách sản phẩm ✅
```

---

### 6️⃣ CẬP NHẬT TEST TEMPLATE (test.html)

**📍 File**: `my-client/src/app/test/test.html`

**Trước:**

```html
<div class="container">
  <button class="btn btn-outline-primary">Get Product</button>
  <div class="list-group mt-3">
    <div class="list-group-item">Hello</div>
    <div class="list-group-item">Hi</div>
    <div class="list-group-item">Welcome</div>
  </div>
</div>
```

**Sau:**

```html
<div class="container">
  <!-- ✅ Button với event binding (click) -->
  <!-- ✅ Property binding [disabled] để disable khi loading -->
  <!-- ✅ Interpolation {{ }} để dynamic text -->
  <button
    class="btn btn-outline-primary"
    (click)="getProducts()"
    [disabled]="loading()"
  >
    {{ loading() ? 'Loading...' : 'Get Product' }}
  </button>

  <!-- ✅ Structural directive *ngIf: hiển thị khi có error -->
  <div *ngIf="error()" class="alert alert-danger mt-3">{{ error() }}</div>

  <!-- ✅ Danh sách sản phẩm -->
  <div class="list-group mt-3">
    <!-- Thông báo nếu chưa load hoặc kết quả rỗng -->
    <div *ngIf="products().length === 0" class="text-muted">
      No products loaded
    </div>

    <!-- ✅ Structural directive *ngFor: loop qua mảng products -->
    <!-- ✅ Template variable 'product' có thể dùng trong loop -->
    <div *ngFor="let product of products()" class="list-group-item">
      <strong>{{ product.productName }}</strong> - ${{ product.productPrice }}
    </div>
  </div>
</div>
```

**Giải Thích Chi Tiết - Angular Template Syntax:**

| Syntax      | Tên                  | Ví Dụ                          | Mục Đích                          |
| ----------- | -------------------- | ------------------------------ | --------------------------------- |
| `{{ }}`     | Interpolation        | `{{ loading() }}`              | Output giá trị lên template       |
| `[ ]`       | Property Binding     | `[disabled]="loading()"`       | Binding property của HTML element |
| `( )`       | Event Binding        | `(click)="getProducts()"`      | Lắng nghe event từ user           |
| `[( )]`     | Two-way Binding      | `[(ngModel)]="name"`           | Sync dữ liệu 2 chiều              |
| `*ngIf`     | Structural Directive | `*ngIf="error()"`              | Show/hide element                 |
| `*ngFor`    | Structural Directive | `*ngFor="let p of products()"` | Loop qua mảng                     |
| `*ngSwitch` | Structural Directive | `*ngSwitchCase="'admin'"`      | Conditional switch                |

**1. Event Binding - (click):**

```html
<button (click)="getProducts()"></button>
```

- **Event**: click event từ button
- **Handler**: getProducts() method của component
- **Flow**: User click → Browser trigger click event → Angular gọi getProducts() method

**2. Property Binding - [disabled]:**

```html
<button [disabled]="loading()"></button>
```

- **Property**: disabled attribute của button HTML
- **Value**: `loading()` signal value (boolean)
- **Behavior**:
  - Khi loading = true → button bị disable (không click được)
  - Khi loading = false → button enable bình thường
- **Lợi ích**: Prevent double-click, feedback cho user

**3. Interpolation - {{ }}:**

```html
{{ loading() ? 'Loading...' : 'Get Product' }}
```

- **Ternary operator**: condition ? trueValue : falseValue
- **Result**:
  - Nếu loading() = true → "Loading..."
  - Nếu loading() = false → "Get Product"
- **User experience**: Button text thay đổi, user biết đang load

**4. Structural Directive - \*ngIf:**

```html
<div *ngIf="error()" class="alert alert-danger mt-3">{{ error() }}</div>
```

- **Condition**: error() khác null/empty
- **Behavior**:
  - Nếu có error → Element được render vào DOM
  - Nếu không có error → Element bị remove khỏi DOM (không chỉ hide)
- **Lợi ích**: Error message chỉ hiển thị khi cần

**5. Structural Directive - \*ngFor:**

```html
<div *ngFor="let product of products()" class="list-group-item">
  <strong>{{ product.productName }}</strong> - ${{ product.productPrice }}
</div>
```

- **Loop**: Duyệt qua mỗi item trong `products()` array
- **Template variable**: `product` = hiện tại item trong loop
- **Repeat**: Div này được render lặp lại số lần = length của array
- **Example**:

```
products() = [
  { productCode: 1, productName: 'Heineken', productPrice: 19000 },
  { productCode: 2, productName: 'Tiger', productPrice: 18000 }
]

→ Render 2 div:
  <div class="list-group-item">
    <strong>Heineken</strong> - $19000
  </div>
  <div class="list-group-item">
    <strong>Tiger</strong> - $18000
  </div>
```

---

### 7️⃣ THÊM HttpClient PROVIDER (app.config.ts)

**📍 File**: `my-client/src/app/app.config.ts`

**Trước:**

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // ❌ Thiếu HttpClient
  ],
};
```

**Sau:**

```typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http"; // ✅ Import provider

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // ✅ Thêm provider
  ],
};
```

**Giải Thích Chi Tiết - Dependency Injection & Providers:**

**Standalone Apps vs Module Apps:**

```typescript
// ❌ Module Apps (Angular <= 14)
@NgModule({
  imports: [HttpClientModule], // Import Module
  providers: [ProductService], // Register services
})
export class AppModule {}

// ✅ Standalone Apps (Angular 15+)
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Provide service
    provideRouter(routes), // Provide router
  ],
};

bootstrapApplication(App, appConfig);
```

**DI Container hoạt động thế nào:**

```
DI Container (Dependency Injection)
────────────────────────────────────

1. Setup Phase (Application bootstrap):
   appConfig.providers = [
     provideHttpClient(),
     provideRouter(routes)
   ]
   ↓ (Container lưu trữ)

2. Request Phase (Component inject):
   constructor(private http: HttpClient) { }
   ↓ (Component yêu cầu HttpClient)

3. Resolution Phase (Container tìm):
   Container: "Ai cung cấp HttpClient?"
   Lookup: provideHttpClient → found!
   ↓

4. Creation Phase (Nếu cần):
   Tạo instance HttpClient
   ↓

5. Injection Phase:
   Gán instance HttpClient vào constructor parameter
   ✅ Thành công
```

**Nếu không có provideHttpClient():**

```
DI Container tìm HttpClient provider
         ↓
    Không tìm thấy
         ↓
    Throw Error: NG0201
    "No provider found for HttpClient"
```

**Hierarchical DI:**

```
Application Level (Root)
├── app.config.ts
│   └── provideHttpClient() ← Every service can inject HttpClient
│
├── Component A
│   └── service: ProductService (can inject HttpClient)
│
├── Component B
│   └── service: OrderService (can inject HttpClient)
```

---

### 8️⃣ CẬP NHẬT APP COMPONENT (app.ts)

**📍 File**: `my-client/src/app/app.ts`

**Trước:**

```typescript
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HttpClientModule } from "@angular/common/http"; // ❌ Module (cách cũ)
import { Test } from "./test/test";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Test, HttpClientModule], // ❌ Import Module vào imports
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("my-client");
}
```

**Sau:**

```typescript
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Test } from "./test/test";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Test], // ✅ Chỉ import components, directives
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("my-client");
}
```

**Giải Thích Chi Tiết - Standalone Components Pattern:**

**Khác biệt Module vs Standalone:**

```typescript
// ❌ OLD: Module Pattern
@NgModule({
  declarations: [AppComponent], // Khai báo component
  imports: [
    BrowserModule, // Module
    HttpClientModule, // Module
    CommonModule, // Module
    FormsModule, // Module
  ],
  providers: [ProductService], // Services
  bootstrap: [AppComponent], // Root component
})
export class AppModule {}

// ✅ NEW: Standalone Component Pattern
@Component({
  selector: "app-root",
  standalone: true, // hoặc không cần property này
  imports: [
    // Import components, directives, pipes
    CommonModule, // Cung cấp *ngIf, *ngFor, etc.
    TestComponent, // Custom component
    // ❌ KHÔNG import HttpClientModule ở đây
  ],
})
export class App {}

// Cấu hình trong main.ts/app.config.ts:
bootstrapApplication(App, {
  providers: [
    provideHttpClient(), // ✅ Provide services ở đây
    provideRouter(routes),
  ],
});
```

**Imports property trong Standalone Component:**

```typescript
imports: [
  CommonModule, // ✅ Directives: *ngIf, *ngFor, ...
  FormsModule, // ✅ [(ngModel)], ngForm
  TestComponent, // ✅ Custom component
  HttpClientModule, // ❌ KHÔNG import module (cách cũ)
];
```

**Tại sao không import HttpClientModule?**

```
Cách cũ (Module):
└─ @NgModule({
     imports: [HttpClientModule]  ← Module cung cấp HttpClient service
   })

Cách mới (Standalone):
└─ @Component({
     imports: []  ← Không cần import module
   })
   └─ app.config.ts:
      providers: [provideHttpClient()]  ← Provide service ở đây
```

**Rule of thumb:**

- `imports[]` = Components, Directives, Pipes, Modules
- `providers[]` (trong app.config.ts) = Services, Tokens

---

### 9️⃣ THÊM RouterOutlet (app.html)

**📍 File**: `my-client/src/app/app.html`

**Trước:**

```html
<h3 class="bg-primary text-center p-3">Product List</h3>
<app-test></app-test>
```

**Sau:**

```html
<h3 class="bg-primary text-center p-3">Product List</h3>
<app-test></app-test>
<router-outlet></router-outlet>
<!-- ✅ Thêm dòng này -->
```

**Giải Thích Chi Tiết - Router Architecture:**

**RouterOutlet là gì?**

```html
<router-outlet></router-outlet>
```

- **Placeholder**: Nơi Angular render component theo route
- **Dynamic**: Component được load dựa trên URL

**Example - Multi-page App:**

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'about', component: AboutComponent }
];

// app.html
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/products">Products</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet></router-outlet>  ← Component được render ở đây
```

**Khi user navigate:**

```
URL: http://localhost:4200/
      ↓
Router match: route ''
      ↓
Component: HomeComponent
      ↓
Render: HomeComponent content vào <router-outlet></router-outlet>

────────────────────────────────────

URL: http://localhost:4200/products
      ↓
Router match: route 'products'
      ↓
Component: ProductsComponent
      ↓
Render: ProductsComponent content vào <router-outlet></router-outlet>
```

**Cảnh báo NG8113 - Tại sao?**

```
app.ts:
  imports: [RouterOutlet, Test]  ← RouterOutlet được import

app.html:
  <app-test></app-test>
  (không có <router-outlet>)

Router: "Có RouterOutlet imported nhưng không used?"
        → Warning NG8113
```

**Fix:**

```html
<app-test></app-test> <router-outlet></router-outlet> ← Thêm, warning fixed
```

---

## 🔄 Cách Hoạt Động

### Diagram: User Click Button → Display Products

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│                     (localhost:4200)                                │
│                                                                     │
│  ┌─────────────────────────────────────┐                           │
│  │ [Get Product Button]                │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             │ 1. User Click                                         │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ test.ts: getProducts()              │                           │
│  │   loading.set(true)                 │                           │
│  │   error.set(null)                   │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             │ 2. Template re-render                                │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ Button text: "Loading..."           │                           │
│  │ Button disabled: true               │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑
                     HTTP GET /products
                          (CORS)
                              ↓↑
┌─────────────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                                │
│                    (localhost:3000)                                 │
│                                                                     │
│  ┌─────────────────────────────────────┐                           │
│  │ CORS Middleware                     │                           │
│  │   Check: Access-Control headers     │                           │
│  │   Allow: localhost:4200             │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ app.get('/products', (req, res))    │                           │
│  │   return hardcoded products array   │                           │
│  │   (hoặc fetch từ MongoDB)           │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ Response JSON:                      │                           │
│  │ [                                   │                           │
│  │   {productCode:1, productName:...}, │                           │
│  │   {productCode:2, productName:...}  │                           │
│  │ ]                                   │                           │
│  └─────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑
                      Response JSON
                              ↓↑
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND AGAIN                              │
│                                                                     │
│  ┌─────────────────────────────────────┐                           │
│  │ HttpClient.get() Response           │                           │
│  │ → subscribe.next()                  │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ products.set(data)                  │                           │
│  │ loading.set(false)                  │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             ↓                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ Template re-render                  │                           │
│  │   products().length > 0 = true      │                           │
│  │   *ngFor loop renders items         │                           │
│  └──────────┬──────────────────────────┘                           │
│             │                                                       │
│             ↓                                                       │
│  ┌──────────────────────────────────────────────────┐              │
│  │ Product List:                                    │              │
│  │ ────────────────────────────────────────────────│              │
│  │ │ Heineken - $19000                           │              │
│  │ ├──────────────────────────────────────────────┤              │
│  │ │ Tiger - $18000                              │              │
│  │ ├──────────────────────────────────────────────┤              │
│  │ │ Sapporo - $21000                            │              │
│  │ └──────────────────────────────────────────────┘              │
│  └──────────────────────────────────────────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### State Transitions (Signal Changes)

```
Initial State:
  products = []
  loading = false
  error = null

User clicks button:
  loading = true      ← Button shows "Loading..."
  error = null

API Returns:
  products = [Heineken, Tiger, Sapporo]
  loading = false     ← Button shows "Get Product" again
  error = null

Template updates automatically (Signals are reactive):
  *ngFor renders 3 list items
  Error div hidden
  Button enabled
```

---

## 🚀 Hướng Dẫn Chạy

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB running (hoặc có connection string)
- Visual Studio Code

### Step 1: Clone/Setup Project

```bash
# Project structure đã tồn tại tại:
# d:\Downloads D\Study\HK 8\WEB 2\code\example\example

# Kiểm tra structure
dir "d:\Downloads D\Study\HK 8\WEB 2\code\example\example"
# Output:
# my_server/
# my-client/
```

### Step 2: Install Dependencies - Backend

```bash
# Vào thư mục backend
cd "d:\Downloads D\Study\HK 8\WEB 2\code\example\example\my_server"

# Install packages
npm install

# Kiểm tra CORS đã được thêm
# Mở file: my_server/index.js
# Kiểm tra: const cors = require('cors');
#           app.use(cors());
```

### Step 3: Install Dependencies - Frontend

```bash
# Vào thư mục frontend
cd "d:\Downloads D\Study\HK 8\WEB 2\code\example\example\my-client"

# Install packages (bootstrap phải đúng tên "bootstrap" chứ không "boostrap")
npm install

# Verify bootstrap installed
npm list bootstrap  # Should show: bootstrap@5.3.0
```

### Step 4: Start Backend Server

```bash
# Terminal 1
cd "d:\Downloads D\Study\HK 8\WEB 2\code\example\example\my_server"

npm start
# Output:
# [nodemon] starting `node index.js`
# Example app listening port 3000
# Connected to MongoDB
```

### Step 5: Start Frontend Server

```bash
# Terminal 2
cd "d:\Downloads D\Study\HK 8\WEB 2\code\example\example\my-client"

npm run start
# Output:
# Application bundle generation complete.
# Watch mode enabled.
# ➜  Local:   http://localhost:4200/
```

### Step 6: Test Application

1. Mở trình duyệt: `http://localhost:4200`
2. Thấy heading: "Product List" (Bootstrap styling)
3. Click nút "Get Product"
4. Thấy button text: "Loading..." (1-2 giây)
5. Thấy danh sách sản phẩm:
   - Heineken - $19000
   - Tiger - $18000
   - Sapporo - $21000

### Troubleshooting

**Lỗi: Port 3000 đã được sử dụng**

```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc đổi port trong my_server/index.js
const port = 3001;  // Change port
```

**Lỗi: Bootstrap CSS không load**

```bash
# Verify:
1. Check package.json: "bootstrap": "^5.3.0" (not "boostrap")
2. Check angular.json: "node_modules/bootstrap/dist/css/bootstrap.min.css"
3. npm install
4. npm run start
```

**Lỗi: CORS error**

```bash
# Verify:
1. my_server/index.js có app.use(cors()) chưa?
2. npm install cors (trong my_server)
3. Restart backend server
```

**Lỗi: HttpClient not provided**

```bash
# Verify:
1. Check app.config.ts: provideHttpClient() có không?
2. Check app.ts: không import HttpClientModule
3. npm run start
```

---

## 📊 Summary Table

| Lỗi                     | Nguyên Nhân        | Giải Pháp               | File          |
| ----------------------- | ------------------ | ----------------------- | ------------- |
| Bootstrap CSS not found | Typo "boostrap"    | Fix package.json        | package.json  |
| CSS/JS path wrong       | Trỏ tới src/assets | Trỏ tới node_modules    | angular.json  |
| CORS error              | No CORS header     | app.use(cors())         | index.js      |
| Service not provided    | No provider        | provideHttpClient()     | app.config.ts |
| No HttpClientModule     | Module approach    | provideHttpClient()     | app.config.ts |
| RouterOutlet warning    | Not used           | Add <router-outlet>     | app.html      |
| Service logic missing   | Empty component    | Add signals + subscribe | test.ts       |
| Static template         | No dynamic data    | Add bindings            | test.html     |

---

## 🎓 Concepts Learned

1. **Bootstrap Integration** - Linking CSS frameworks với Angular
2. **CORS** - Cho phép cross-origin requests
3. **Dependency Injection** - Cấp số trong Angular
4. **Services** - Tách logic API calls
5. **Signals** - Reactive state management (Angular 16+)
6. **RxJS Observables** - Async data streams
7. **Template Binding** - Event, Property, Interpolation
8. **Structural Directives** - *ngIf, *ngFor
9. **Standalone Components** - Không cần NgModule
10. **HTTP Requests** - GET API từ backend

---

## 📚 Resources

- [Angular Official Docs](https://angular.io/docs)
- [Signals Guide](https://angular.io/guide/signals)
- [RxJS Documentation](https://rxjs.dev)
- [Express.js Guide](https://expressjs.com/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Đánh dấu hoàn thành!** ✅

Tất cả 9 thay đổi đã được triển khai thành công. Ứng dụng sẵn sàng chạy!
