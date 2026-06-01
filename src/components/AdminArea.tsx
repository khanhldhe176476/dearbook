import React, { useEffect, useMemo, useState } from "react";

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
    collectionName?: string;
    productType?: string;
    productSize?: string;
    quantity?: number;
    note?: string;
    status: OrderStatus | string;
    totalPrice?: number;
    createdAt?: string;
    updatedAt?: string;
    pages?: PageData[];
    customPages?: PageData[];
    designPages?: PageData[];
};

const API_BASE = "/api/admin";

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

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

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
                    username,
                    password,
                }),
            });

            if (!res.ok) {
                throw new Error("Sai tài khoản hoặc mật khẩu quản trị viên");
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
            setLoginError("Sai tài khoản hoặc mật khẩu quản trị viên");
        } finally {
            setLoadingLogin(false);
        }
    }

    async function loadOrders() {
        setLoadingOrders(true);
        try {
            const data = await adminFetch("/orders");
            const list = Array.isArray(data) ? data : data.orders || data.content || [];
            setOrders(list);
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

    function handleLogout() {
        clearToken();
        setTokenState("");
        setOrders([]);
        setSelectedOrder(null);
    }

    useEffect(() => {
        if (isLoggedIn) {
            loadOrders();
        }
    }, [isLoggedIn]);

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

    const selectedPages =
        selectedOrder?.pages ||
        selectedOrder?.customPages ||
        selectedOrder?.designPages ||
        [];

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

                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-stone-300 px-4 py-2 font-semibold text-stone-700 hover:bg-stone-100"
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <section className="grid gap-4 md:grid-cols-5">
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
                </section>

                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-xl font-bold text-stone-900">Danh sách đơn hàng</h2>

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
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b text-sm text-stone-500">
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
                                            <td className="py-4 pr-4">{formatMoney(order.totalPrice)}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-4 pr-4">{formatDate(order.createdAt)}</td>
                                            <td className="py-4 pr-4">
                                                <button
                                                    onClick={() => openOrderDetail(order.id)}
                                                    className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                                <b>Địa chỉ:</b> {selectedOrder.address || "—"}
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
                                                <b>Tổng tiền:</b> {formatMoney(selectedOrder.totalPrice)}
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

                                <div className="mt-6 rounded-2xl border p-5">
                                    <h3 className="mb-3 font-bold">Ghi chú của khách hàng</h3>
                                    <p className="whitespace-pre-wrap text-sm text-stone-700">
                                        {selectedOrder.note || "Không có ghi chú."}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="mb-4 font-bold">Preview thiết kế photobook</h3>

                                    {selectedPages.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed p-10 text-center text-stone-500">
                                            Chưa có dữ liệu thiết kế để preview.
                                        </div>
                                    ) : (
                                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                            {selectedPages.map((page, index) => (
                                                <PagePreview key={index} page={page} index={index} />
                                            ))}
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