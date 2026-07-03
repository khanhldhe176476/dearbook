import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../lib/api";

type OrderStatus = "PENDING" | "CONFIRMED" | "PRINTING" | "COMPLETED" | "CANCELLED";

type PageElement = {
    type?: string;
    text?: string;
    content?: string;
    src?: string;
    url?: string;
    imageUrl?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
};

type PageData = {
    pageNumber?: number;
    backgroundColor?: string;
    elements?: PageElement[];
};

type AdminOrder = {
    id: string;
    customerName?: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
    collectionName?: string;
    productType?: string;
    productSize?: string;
    quantity?: number;
    note?: string;
    paymentMethod?: string;
    totalAmount?: number;
    totalPrice?: number;
    status: OrderStatus | string;
    createdAt?: string;
    updatedAt?: string;
    pages?: PageData[];
    customPages?: PageData[];
    designPages?: PageData[];
    pdfFileName?: string;
    pdfFileData?: string;
    pdfFileAvailable?: boolean;
};

const API_BASE = `${API_BASE_URL.replace(/\/$/, "")}/api/admin`;

const statusLabels: Record<string, string> = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PRINTING: "Đang in",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
};

const statusClass: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    PRINTING: "bg-purple-100 text-purple-800 border-purple-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

function getToken() {
    return localStorage.getItem("dearbook_admin_token") || "";
}

function setToken(token: string) {
    localStorage.setItem("dearbook_admin_token", token);
}

function clearToken() {
    localStorage.removeItem("dearbook_admin_token");
}

function formatDate(value?: string) {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleString("vi-VN");
    } catch {
        return value;
    }
}

function formatMoney(value?: number) {
    if (value == null || Number.isNaN(value)) return "—";
    return value.toLocaleString("vi-VN") + "đ";
}

async function downloadOrderPdf(pdfFileData: string, fileName: string) {
    try {
        const url = pdfFileData.startsWith('http') ? pdfFileData : `${API_BASE_URL}${pdfFileData}`;

        // Phải dùng fetch với Authorization header vì /api/orders/** yêu cầu authenticated
        // (click <a> tag thông thường không gửi kèm JWT token)
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!res.ok) {
            let message = `Server tra ve ${res.status}`;
            try {
                const body = await res.text();
                if (body) {
                    const contentType = res.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                        const data = JSON.parse(body);
                        message += data.message ? `: ${data.message}` : `: ${body}`;
                    } else {
                        message += `: ${body}`;
                    }
                }
            } catch {
                // Keep the HTTP status as the fallback message.
            }
            throw new Error(message);
        }

        const blob = await res.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName || 'design.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
        console.error('[Admin] Tải PDF thất bại:', err);
        alert(
            'Không thể tải file PDF thiết kế.\n\n' +
            (err.message ? 'Lỗi: ' + err.message + '\n\n' : '') +
            'Nguyên nhân có thể:\n' +
            '• File không còn tồn tại trên máy chủ\n' +
            '• Phiên đăng nhập admin hết hạn (thử đăng xuất & đăng nhập lại)\n' +
            '• Kết nối mạng bị gián đoạn'
        );
    }
}

async function uploadOrderPdf(orderId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/pdf`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server tra ve ${res.status}`);
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status] || "bg-gray-100 text-gray-700 border-gray-200"
                }`}
        >
            {statusLabels[status] || status}
        </span>
    );
}

function PagePreview({ page, index }: { page: PageData; index: number }) {
    const elements = page.elements || [];

    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-700">
                Trang {page.pageNumber || index + 1}
            </div>

            <div
                className="relative mx-auto overflow-hidden rounded-lg border shadow-inner"
                style={{
                    width: 220,
                    height: 300,
                    background: page.backgroundColor || "#fffaf5",
                }}
            >
                {elements.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs text-gray-400">
                        Không có dữ liệu thiết kế cho trang này
                    </div>
                ) : (
                    elements.map((el, i) => {
                        const left = el.x ?? 20;
                        const top = el.y ?? 20;
                        const width = el.width ?? 120;
                        const height = el.height ?? 40;
                        const isImage = el.type === "image" || el.src || el.url || el.imageUrl;
                        const imageSrc = el.src || el.url || el.imageUrl;

                        return (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    left,
                                    top,
                                    width,
                                    minHeight: height,
                                    color: el.color || "#222",
                                    fontSize: el.fontSize || 12,
                                    fontFamily: el.fontFamily || "serif",
                                }}
                            >
                                {isImage && imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        alt="Design element"
                                        className="h-full w-full rounded object-cover"
                                        style={{ height }}
                                    />
                                ) : (
                                    <div className="whitespace-pre-wrap break-words">
                                        {el.text || el.content || "Text"}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default function AdminArea() {
    const [tokenState, setTokenState] = useState(getToken());
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);

    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const PAGE_SIZE = 20;

    // Visit stats
    const [visitStats, setVisitStats] = useState<{
        total: number;
        today: number;
        last7Days: { day: string; count: number }[];
    } | null>(null);

    const isLoggedIn = Boolean(tokenState);

    async function adminFetch(path: string, options: RequestInit = {}) {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
                ...(options.headers || {}),
            },
        });

        if (res.status === 401 || res.status === 403) {
            clearToken();
            setTokenState("");
            throw new Error("Phiên đăng nhập đã hết hạn");
        }

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Request failed");
        }

        return res.json();
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginError("");
        setLoadingLogin(true);

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                }),
            });

            if (!res.ok) {
                let message = "Sai tài khoản hoặc mật khẩu quản trị viên";
                try {
                    const body = await res.text();
                    if (body) {
                        const contentType = res.headers.get("content-type") || "";
                        if (contentType.includes("application/json")) {
                            const data = JSON.parse(body);
                            message = data.message || message;
                        } else {
                            message = body;
                        }
                    }
                } catch {
                    // Keep the generic login message.
                }
                throw new Error(message);
            }

            const data = await res.json();
            const token = data.token || data.accessToken;

            if (!token) {
                throw new Error("Backend không trả về token đăng nhập");
            }

            setToken(token);
            setTokenState(token);
            setPassword("");
        } catch (err) {
            console.error(err);
            setLoginError(err instanceof Error ? err.message : "Sai tài khoản hoặc mật khẩu quản trị viên");
        } finally {
            setLoadingLogin(false);
        }
    }

    async function loadOrders(page?: number) {
        setLoadingOrders(true);
        try {
            const p = page ?? currentPage;
            const data = await adminFetch(`/orders?page=${p}&size=${PAGE_SIZE}`);
            // Handle paginated response: { orders, page, size, totalElements, totalPages }
            const list = Array.isArray(data) ? data : data.orders || data.content || [];
            setOrders(list);
            setCurrentPage(data.page ?? 0);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? list.length);
            setLastRefresh(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOrders(false);
        }
    }

    async function openOrderDetail(orderId: string) {
        setDetailLoading(true);
        try {
            const data = await adminFetch(`/orders/${orderId}`);
            setSelectedOrder(data);
        } catch (err) {
            console.error(err);
            alert("Không thể tải chi tiết đơn hàng");
        } finally {
            setDetailLoading(false);
        }
    }

    async function updateStatus(orderId: string, status: string) {
        try {
            const data = await adminFetch(`/orders/${orderId}/status`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });

            setOrders((prev) =>
                prev.map((item) => (item.id === orderId ? { ...item, status } : item))
            );

            setSelectedOrder((prev) => (prev ? { ...prev, ...(data || {}), status } : prev));
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật trạng thái đơn hàng");
        }
    }

    async function handleReplacePdf(file?: File | null) {
        if (!selectedOrder || !file) return;

        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            alert("Vui lòng chọn file PDF hợp lệ.");
            return;
        }

        setUploadingPdf(true);
        try {
            await uploadOrderPdf(selectedOrder.id, file);
            const updated = await adminFetch(`/orders/${selectedOrder.id}`);
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((item) => (item.id === selectedOrder.id ? { ...item, ...updated } : item))
            );
            alert("Đã tải lại file PDF cho đơn hàng này.");
        } catch (err) {
            console.error(err);
            alert("Không thể tải lại file PDF: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setUploadingPdf(false);
        }
    }

    async function deleteOrder(orderId: string) {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.")) {
            return;
        }
        try {
            await adminFetch(`/orders/${orderId}`, {
                method: "DELETE",
            });
            setOrders((prev) => prev.filter((item) => item.id !== orderId));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(null);
            }
        } catch (err) {
            console.error(err);
            alert("Không thể xóa đơn hàng: " + err);
        }
    }

    async function deleteSelectedOrders() {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedOrderIds.length} đơn hàng đã chọn? Hành động này không thể hoàn tác.`)) {
            return;
        }
        try {
            await adminFetch(`/orders/bulk`, {
                method: "DELETE",
                body: JSON.stringify({ ids: selectedOrderIds }),
            });
            setOrders((prev) => prev.filter((item) => !selectedOrderIds.includes(item.id)));
            if (selectedOrder?.id && selectedOrderIds.includes(selectedOrder.id)) {
                setSelectedOrder(null);
            }
            setSelectedOrderIds([]); // clear selection
        } catch (err) {
            console.error(err);
            alert("Không thể xóa các đơn hàng đã chọn: " + err);
        }
    }

    function handleLogout() {
        clearToken();
        setTokenState("");
        setOrders([]);
        setSelectedOrder(null);
    }

    useEffect(() => {
        if (isLoggedIn) {
            loadOrders();
            loadVisitStats();
        }
    }, [isLoggedIn]);

    async function loadVisitStats() {
        try {
            const data = await adminFetch("/stats/visits");
            setVisitStats({
                total: data.total ?? 0,
                today: data.today ?? 0,
                last7Days: (data.last7Days ?? []).map((d: { day: string; count: number }) => ({
                    day: d.day,
                    count: Number(d.count),
                })),
            });
        } catch (err) {
            console.error("Could not load visit stats:", err);
        }
    }

    // Auto-polling disabled — orders are only refreshed manually via the "Làm mới" button.
    // To re-enable, uncomment the setInterval block below.

    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter((o) => o.status === "PENDING").length,
            printing: orders.filter((o) => o.status === "PRINTING").length,
            completed: orders.filter((o) => o.status === "COMPLETED").length,
            cancelled: orders.filter((o) => o.status === "CANCELLED").length,
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const q = search.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

            const text = [
                order.id,
                order.customerName,
                order.name,
                order.phone,
                order.email,
                order.collectionName,
                order.productType,
                order.productSize,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = !q || text.includes(q);

            return matchesStatus && matchesSearch;
        });
    }, [orders, search, statusFilter]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#faf7f2] px-4 py-16">
                <div className="mx-auto max-w-xl rounded-3xl border border-stone-200 bg-white p-10 shadow-xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-4xl">
                        🔒
                    </div>

                    <h1 className="text-center text-3xl font-bold text-stone-900">
                        Trang Quản Trị DearBook
                    </h1>
                    <p className="mt-3 text-center text-stone-500">
                        Chỉ dành cho quản trị viên được ủy quyền.
                    </p>

                    {loginError && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-2 block font-semibold text-stone-700">
                                Tên đăng nhập admin
                            </label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-900"
                                placeholder="admin"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold text-stone-700">
                                Mật khẩu bảo mật
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-900"
                                placeholder="Nhập mật khẩu admin"
                            />
                        </div>

                        <a href="/" className="block text-sm text-stone-600 hover:text-stone-900">
                            Quay lại Trang chủ
                        </a>

                        <button
                            type="submit"
                            disabled={loadingLogin}
                            className="w-full rounded-xl bg-black px-5 py-4 font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingLogin ? "Đang đăng nhập..." : "Đăng nhập hệ thống"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f4ef]">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">
                            Dashboard Quản Trị DearBook
                        </h1>
                        <p className="text-sm text-stone-500">
                            Quản lý đơn đặt in photobook và dữ liệu thiết kế của khách hàng.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Last refresh timestamp (manual only) */}
                        {lastRefresh && (
                            <span className="hidden sm:inline text-xs text-stone-400">
                                Cập nhật lúc {lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        )}

                        {/* Manual refresh button */}
                        <button
                            onClick={() => loadOrders()}
                            disabled={loadingOrders}
                            className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-1.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-50 transition-all"
                            title="Tải lại danh sách đơn hàng"
                        >
                            <svg className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden md:inline">Làm mới</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-stone-300 px-4 py-2 font-semibold text-stone-700 hover:bg-stone-100"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Tổng đơn</p>
                        <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Chờ xử lý</p>
                        <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Đang in</p>
                        <p className="mt-2 text-3xl font-bold">{stats.printing}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Hoàn thành</p>
                        <p className="mt-2 text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Đã hủy</p>
                        <p className="mt-2 text-3xl font-bold">{stats.cancelled}</p>
                    </div>
                    {/* Visitor stats cards */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">👁</span>
                            <p className="text-sm font-medium text-indigo-700">Lượt xem</p>
                        </div>
                        <p className="mt-1 text-3xl font-bold text-indigo-900">
                            {visitStats != null ? visitStats.total.toLocaleString('vi-VN') : '—'}
                        </p>
                        <p className="mt-1 text-xs text-indigo-500">Tổng tất cả thời gian</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📅</span>
                            <p className="text-sm font-medium text-emerald-700">Hôm nay</p>
                        </div>
                        <p className="mt-1 text-3xl font-bold text-emerald-900">
                            {visitStats != null ? visitStats.today.toLocaleString('vi-VN') : '—'}
                        </p>
                        <p className="mt-1 text-xs text-emerald-500">Lượt truy cập hôm nay</p>
                    </div>
                </section>

                {/* 7-day visit chart */}
                {visitStats && visitStats.last7Days.length > 0 && (
                    <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-stone-700">📊 Lượt truy cập 7 ngày gần nhất</h2>
                        <div className="flex items-end gap-2 h-24">
                            {(() => {
                                const maxCount = Math.max(...visitStats.last7Days.map(d => d.count), 1);
                                return visitStats.last7Days.map((d, i) => (
                                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                                        <span className="text-[10px] text-stone-500 font-medium">
                                            {d.count > 0 ? d.count : ''}
                                        </span>
                                        <div
                                            className="w-full rounded-t-md bg-indigo-400 transition-all"
                                            style={{
                                                height: `${Math.max((d.count / maxCount) * 72, d.count > 0 ? 4 : 1)}px`,
                                                opacity: d.count > 0 ? 1 : 0.2,
                                            }}
                                        />
                                        <span className="text-[10px] text-stone-400">{d.day}</span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </section>
                )}

                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-stone-900">Danh sách đơn hàng</h2>
                            {selectedOrderIds.length > 0 && (
                                <button 
                                    onClick={deleteSelectedOrders}
                                    className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200"
                                >
                                    Xóa {selectedOrderIds.length} mục đã chọn
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm theo tên, SĐT, email, mã đơn..."
                                className="w-full rounded-xl border border-stone-300 px-4 py-2 md:w-80"
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-xl border border-stone-300 px-4 py-2"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="CONFIRMED">Đã xác nhận</option>
                                <option value="PRINTING">Đang in</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </select>
                        </div>
                    </div>

                    {loadingOrders ? (
                        <div className="py-10 text-center text-stone-500">Đang tải đơn hàng...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-10 text-center text-stone-500">
                            Chưa có đơn hàng phù hợp.
                        </div>
                    ) : (
                        <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b text-sm text-stone-500">
                                        <th className="py-3 pr-4 pl-2">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded text-black focus:ring-black border-stone-300"
                                                checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedOrderIds(filteredOrders.map(o => o.id));
                                                    } else {
                                                        setSelectedOrderIds([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="py-3 pr-4">Mã đơn</th>
                                        <th className="py-3 pr-4">Khách hàng</th>
                                        <th className="py-3 pr-4">Liên hệ</th>
                                        <th className="py-3 pr-4">Sản phẩm</th>
                                        <th className="py-3 pr-4">SL</th>
                                        <th className="py-3 pr-4">Tổng tiền</th>
                                        <th className="py-3 pr-4">Trạng thái</th>
                                        <th className="py-3 pr-4">Ngày tạo</th>
                                        <th className="py-3 pr-4">Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b text-sm">
                                            <td className="py-4 pr-4 pl-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded text-black focus:ring-black border-stone-300"
                                                    checked={selectedOrderIds.includes(order.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedOrderIds(prev => [...prev, order.id]);
                                                        } else {
                                                            setSelectedOrderIds(prev => prev.filter(id => id !== order.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="max-w-[120px] truncate py-4 pr-4 font-mono">
                                                {order.id}
                                            </td>
                                            <td className="py-4 pr-4 font-semibold">
                                                {order.customerName || order.name || "—"}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>{order.phone || "—"}</div>
                                                <div className="text-xs text-stone-500">{order.email || "—"}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>{order.collectionName || "—"}</div>
                                                <div className="text-xs text-stone-500">
                                                    {[order.productType, order.productSize].filter(Boolean).join(" / ") ||
                                                        "—"}
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">{order.quantity || 1}</td>
                                            <td className="py-4 pr-4 font-semibold">{formatMoney(order.totalAmount ?? order.totalPrice)}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-4 pr-4">{formatDate(order.createdAt)}</td>
                                            <td className="py-4 pr-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openOrderDetail(order.id)}
                                                        className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                    <button
                                                        onClick={() => deleteOrder(order.id)}
                                                        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4">
                                <p className="text-sm text-stone-500">
                                    Hiển thị {orders.length} / {totalElements} đơn hàng
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { const p = Math.max(0, currentPage - 1); setCurrentPage(p); loadOrders(p); }}
                                        disabled={currentPage === 0}
                                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        ← Trước
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                        // Show pages around current page
                                        let pageNum: number;
                                        if (totalPages <= 7) {
                                            pageNum = i;
                                        } else if (currentPage < 4) {
                                            pageNum = i;
                                        } else if (currentPage > totalPages - 5) {
                                            pageNum = totalPages - 7 + i;
                                        } else {
                                            pageNum = currentPage - 3 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => { setCurrentPage(pageNum); loadOrders(pageNum); }}
                                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                                                    pageNum === currentPage
                                                        ? 'bg-black text-white'
                                                        : 'text-stone-700 hover:bg-stone-100'
                                                }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => { const p = Math.min(totalPages - 1, currentPage + 1); setCurrentPage(p); loadOrders(p); }}
                                        disabled={currentPage >= totalPages - 1}
                                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            </div>
                        )}
                        </>
                    )}
                </section>

                {selectedOrder && (
                    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-stone-900">Chi tiết đơn hàng</h2>
                                <p className="mt-1 font-mono text-sm text-stone-500">
                                    {selectedOrder.id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-xl border px-4 py-2 font-semibold hover:bg-stone-100"
                            >
                                Đóng
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="py-10 text-center text-stone-500">
                                Đang tải chi tiết đơn hàng...
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 lg:grid-cols-3">
                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Thông tin khách hàng</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <b>Họ tên:</b>{" "}
                                                {selectedOrder.customerName || selectedOrder.name || "—"}
                                            </p>
                                            <p>
                                                <b>SĐT:</b> {selectedOrder.phone || "—"}
                                            </p>
                                            <p>
                                                <b>Email:</b> {selectedOrder.email || "—"}
                                            </p>
                                            <p>
                                                <b>Địa chỉ:</b> {[selectedOrder.address, selectedOrder.district, selectedOrder.city].filter(Boolean).join(", ") || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Thông tin photobook</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <b>Collection:</b> {selectedOrder.collectionName || "—"}
                                            </p>
                                            <p>
                                                <b>Loại sách:</b> {selectedOrder.productType || "—"}
                                            </p>
                                            <p>
                                                <b>Kích thước:</b> {selectedOrder.productSize || "—"}
                                            </p>
                                            <p>
                                                <b>Số lượng:</b> {selectedOrder.quantity || 1}
                                            </p>
                                            <p>
                                                <b>Phương thức TT:</b>{" "}
                                                {selectedOrder.paymentMethod === "DEPOSIT"
                                                    ? "Đặt cọc 50%"
                                                    : selectedOrder.paymentMethod === "FULL"
                                                        ? "Thanh toán 100%"
                                                        : selectedOrder.paymentMethod || "—"}
                                            </p>
                                            <p>
                                                <b>Tổng tiền:</b> <span className="font-bold text-emerald-600">{formatMoney(selectedOrder.totalAmount ?? selectedOrder.totalPrice)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Trạng thái xử lý</h3>
                                        <div className="mb-4">
                                            <StatusBadge status={selectedOrder.status} />
                                        </div>

                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                            className="w-full rounded-xl border border-stone-300 px-4 py-3"
                                        >
                                            <option value="PENDING">Chờ xử lý</option>
                                            <option value="CONFIRMED">Đã xác nhận</option>
                                            <option value="PRINTING">Đang in</option>
                                            <option value="COMPLETED">Hoàn thành</option>
                                            <option value="CANCELLED">Đã hủy</option>
                                        </select>
                                    </div>
                                </div>

                                {selectedOrder.note && (
                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <h3 className="mb-3 font-bold flex items-center gap-2 text-amber-800">
                                            📝 Ghi chú của khách hàng
                                        </h3>
                                        <p className="whitespace-pre-wrap text-sm text-amber-900">
                                            {selectedOrder.note}
                                        </p>
                                    </div>
                                )}

                                {/* File PDF thiết kế */}
                                <div className="mt-6 rounded-2xl border p-5">
                                    <h3 className="mb-3 font-bold flex items-center gap-2">
                                        📄 File PDF thiết kế
                                    </h3>
                                    {selectedOrder.pdfFileName && selectedOrder.pdfFileData ? (
                                        <div className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
                                            selectedOrder.pdfFileAvailable === false
                                                ? "bg-red-50 border-red-200"
                                                : "bg-green-50 border-green-200"
                                        }`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-red-500 text-lg font-bold">PDF</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-stone-900 truncate">
                                                        {selectedOrder.pdfFileName}
                                                    </p>
                                                    <p className={`text-xs font-medium ${
                                                        selectedOrder.pdfFileAvailable === false ? "text-red-700" : "text-green-700"
                                                    }`}>
                                                        {selectedOrder.pdfFileAvailable === false
                                                            ? "File không còn trên máy chủ - vui lòng tải lại PDF"
                                                            : "Đã tải lên và sẵn sàng tải xuống"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-2 flex-shrink-0">
                                                {selectedOrder.pdfFileAvailable !== false && (
                                                    <button
                                                        onClick={() => downloadOrderPdf(
                                                            `/api/orders/${selectedOrder.id}/pdf/download`,
                                                            selectedOrder.pdfFileName || 'design.pdf'
                                                        )}
                                                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Tải xuống
                                                    </button>
                                                )}
                                                <label className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                                                    uploadingPdf
                                                        ? "bg-stone-200 text-stone-500"
                                                        : "bg-white border border-stone-300 text-stone-800 hover:bg-stone-100"
                                                }`}>
                                                    {uploadingPdf ? "Đang tải..." : "Tải lại PDF"}
                                                    <input
                                                        type="file"
                                                        accept=".pdf,application/pdf"
                                                        className="hidden"
                                                        disabled={uploadingPdf}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            e.currentTarget.value = "";
                                                            handleReplacePdf(file);
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed p-6 text-center text-stone-500">
                                            <p className="text-sm mb-3">Khách hàng chưa tải lên file PDF thiết kế.</p>
                                            <label className={`inline-flex cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                                                uploadingPdf
                                                    ? "bg-stone-200 text-stone-500"
                                                    : "bg-black text-white hover:bg-stone-800"
                                            }`}>
                                                {uploadingPdf ? "Đang tải..." : "Tải PDF cho đơn này"}
                                                <input
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    className="hidden"
                                                    disabled={uploadingPdf}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        e.currentTarget.value = "";
                                                        handleReplacePdf(file);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>

                            </>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
