# Hướng dẫn sử dụng Data Components

## Cấu trúc thư mục
```
src/
├── components/
│   ├── common/
│   │   ├── DataTable.tsx          # Component table responsive
│   │   ├── DataCard.tsx           # Component card cho mobile
│   │   ├── ResponsiveDataView.tsx # Component kết hợp table + card
│   │   └── index.ts               # Export components
│   └── EmployeeTable.tsx          # Example sử dụng ResponsiveDataView
├── hooks/
│   └── useEmployees.ts            # Hook quản lý employee data
├── services/
│   └── employeeService.ts         # Service API calls
├── styles/
│   └── data-components.css        # CSS cho components
└── utils/
    └── mockData.ts                # Mock data service
```

## 1. DataTable Component

Component table cơ bản với đầy đủ tính năng:

```tsx
import { DataTable, TableColumn } from '@/components/common';

const columns: TableColumn<Employee>[] = [
    {
        key: 'employeeCode',
        title: 'Mã NV',
        sortable: true,
        searchable: true,
        width: '120px',
        render: (value) => <strong>{value}</strong>
    },
    {
        key: 'fullName',
        title: 'Họ tên',
        sortable: true,
        searchable: true,
        responsive: {
            xs: true,  // Hiển thị trên mobile
            sm: true,  // Hiển thị trên tablet
            md: true,  // Hiển thị trên desktop
        }
    }
];

<DataTable
    data={employees}
    columns={columns}
    loading={loading}
    searchable={true}
    sortable={true}
    pagination={true}
    pageSize={10}
    striped={true}
    hover={true}
    actions={{
        render: (record) => (
            <button onClick={() => edit(record)}>Edit</button>
        )
    }}
/>
```

## 2. DataCard Component

Component card cho mobile view:

```tsx
import { DataCard, CardColumn } from '@/components/common';

const cardColumns: CardColumn<Employee>[] = [
    {
        key: 'employeeCode',
        title: 'Mã NV',
        important: true, // Highlight field
    },
    {
        key: 'fullName',
        title: 'Họ tên',
        important: true,
    },
    {
        key: 'department',
        title: 'Phòng ban',
        render: (value) => <span className="badge bg-primary">{value}</span>
    }
];

<DataCard
    data={employees}
    columns={cardColumns}
    loading={loading}
    onCardClick={(employee) => viewDetails(employee)}
    actions={(record) => (
        <div className="btn-group">
            <button onClick={() => edit(record)}>Edit</button>
            <button onClick={() => delete(record.id)}>Delete</button>
        </div>
    )}
/>
```

## 3. ResponsiveDataView Component

Component kết hợp table và card, tự động responsive:

```tsx
import { ResponsiveDataView, ResponsiveColumn } from '@/components/common';

const columns: ResponsiveColumn<Employee>[] = [
    {
        key: 'employeeCode',
        title: 'Mã NV',
        sortable: true,
        searchable: true,
        important: true, // Cho card view
        responsive: {
            xs: true, // Hiển thị trên mobile
            md: true  // Hiển thị trên desktop
        }
    }
];

<ResponsiveDataView
    data={employees}
    columns={columns}
    loading={loading}
    breakpoint="md" // Chuyển từ table sang card tại breakpoint md
    showViewToggle={true} // Hiển thị nút chuyển đổi view
    actions={{
        render: (record) => (
            <div className="btn-group">
                <button onClick={() => edit(record)}>Edit</button>
            </div>
        )
    }}
    cardProps={{
        onCardClick: (employee) => viewDetails(employee)
    }}
/>
```

## 4. useEmployees Hook

Hook quản lý state và API calls:

```tsx
import { useEmployees } from '@/hooks/useEmployees';

function EmployeePage() {
    const {
        employees,
        loading,
        error,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees,
        refreshEmployees,
        clearError
    } = useEmployees({ 
        useMockData: true, 
        autoLoad: true 
    });

    const handleSearch = async (query: string) => {
        await searchEmployees(query);
    };

    const handleCreate = async (data: EmployeeCreateRequest) => {
        try {
            await createEmployee(data);
            alert('Tạo thành công!');
        } catch (error) {
            alert('Tạo thất bại!');
        }
    };

    return (
        <ResponsiveDataView
            data={employees}
            columns={columns}
            loading={loading}
            onSearch={handleSearch}
        />
    );
}
```

## 5. Responsive Breakpoints

Components hỗ trợ responsive với các breakpoint của Bootstrap:

- `xs`: < 576px (Mobile)
- `sm`: ≥ 576px (Mobile lớn)
- `md`: ≥ 768px (Tablet)
- `lg`: ≥ 992px (Desktop)
- `xl`: ≥ 1200px (Desktop lớn)

```tsx
const columns = [
    {
        key: 'email',
        title: 'Email',
        responsive: {
            xs: false, // Ẩn trên mobile
            sm: false, // Ẩn trên mobile lớn
            md: true,  // Hiển thị từ tablet trở lên
            lg: true,
            xl: true
        }
    }
];
```

## 6. Custom Styling

Components sử dụng Bootstrap classes và có thể custom thêm:

```css
/* Trong file CSS của bạn */
.custom-table .table {
    font-size: 0.875rem;
}

.custom-card .card {
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

```tsx
<DataTable
    className="custom-table"
    data={data}
    columns={columns}
/>

<DataCard
    className="custom-card"
    data={data}
    columns={columns}
/>
```

## 7. Các Props chính

### DataTable Props:
- `data`: Mảng dữ liệu
- `columns`: Định nghĩa cột
- `loading`: Trạng thái loading
- `searchable`: Bật/tắt tìm kiếm
- `sortable`: Bật/tắt sắp xếp
- `pagination`: Bật/tắt phân trang
- `pageSize`: Số item per page
- `actions`: Cột actions

### ResponsiveDataView Props:
- Tất cả props của DataTable
- `breakpoint`: Điểm chuyển đổi responsive
- `showViewToggle`: Hiển thị nút chuyển đổi
- `cardProps`: Props cho card view
- `cardView`: Force card view
- `tableView`: Force table view

## 8. Example hoàn chỉnh

Xem file `src/components/EmployeeTable.tsx` để có example hoàn chỉnh về cách sử dụng tất cả tính năng.
