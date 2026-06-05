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
};

const API_BASE = "/api/admin";

const statusLabels: Record<string, string> = {
    PENDING: "Ch x l",
    CONFIRMED: " xc nhn",
    PRINTING: "ang in",
    COMPLETED: "Hon thnh",
    CANCELLED: " hy",
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
    if (!value) return "";
    try {
        return new Date(value).toLocaleString("vi-VN");
    } catch {
        return value;
    }
}

function formatMoney(value?: number) {
    if (value == null || Number.isNaN(value)) return "";
    return value.toLocaleString("vi-VN") + "";
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
                        Khng c d liu thit k cho trang ny
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
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

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
            throw new Error("Phin ng nhp  ht hn");
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
                throw new Error("Sai ti khon hoc mt khu qun tr vin");
            }

            const data = await res.json();
            const token = data.token || data.accessToken;

            if (!token) {
                throw new Error("Backend khng tr v token ng nhp");
            }

            setToken(token);
            setTokenState(token);
            setPassword("");
        } catch (err) {
            console.error(err);
            setLoginError("Sai ti khon hoc mt khu qun tr vin");
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
            alert("Khng th ti chi tit n hng");
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
            alert("Khng th cp nht trng thi n hng");
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

    // Auto-polling: refresh orders every 15 seconds to catch new submissions
    useEffect(() => {
        if (!isLoggedIn) return;
        const interval = setInterval(() => {
            loadOrders();
        }, 15_000);
        return () => clearInterval(interval);
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

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#faf7f2] px-4 py-16">
                <div className="mx-auto max-w-xl rounded-3xl border border-stone-200 bg-white p-10 shadow-xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-4xl">
                        
                    </div>

                    <h1 className="text-center text-3xl font-bold text-stone-900">
                        Trang Qun Tr DearBook
                    </h1>
                    <p className="mt-3 text-center text-stone-500">
                        Ch dnh cho qun tr vin c y quyn.
                    </p>

                    {loginError && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <div>
                            <label className="mb-2 block font-semibold text-stone-700">
                                Tn ng nhp admin
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
                                Mt khu bo mt
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-900"
                                placeholder="Nhp mt khu admin"
                            />
                        </div>

                        <a href="/" className="block text-sm text-stone-600 hover:text-stone-900">
                            Quay li Trang ch
                        </a>

                        <button
                            type="submit"
                            disabled={loadingLogin}
                            className="w-full rounded-xl bg-black px-5 py-4 font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingLogin ? "ang ng nhp..." : "ng nhp h thng"}
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
                            Dashboard Qun Tr DearBook
                        </h1>
                        <p className="text-sm text-stone-500">
                            Qun l n t in photobook v d liu thit k ca khch hng.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Refresh indicator */}
                        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>
                                {lastRefresh
                                    ? `Cp nht lc ${lastRefresh.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                                    : 'ang ti...'}
                            </span>
                        </div>

                        {/* Manual refresh button */}
                        <button
                            onClick={loadOrders}
                            disabled={loadingOrders}
                            className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-1.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-50 transition-all"
                            title="Ti li danh sch n hng"
                        >
                            <svg className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="hidden md:inline">Lm mi</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-stone-300 px-4 py-2 font-semibold text-stone-700 hover:bg-stone-100"
                        >
                            ng xut
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <section className="grid gap-4 md:grid-cols-5">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Tng n</p>
                        <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Ch x l</p>
                        <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">ang in</p>
                        <p className="mt-2 text-3xl font-bold">{stats.printing}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500">Hon thnh</p>
                        <p className="mt-2 text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-stone-500"> hy</p>
                        <p className="mt-2 text-3xl font-bold">{stats.cancelled}</p>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-xl font-bold text-stone-900">Danh sch n hng</h2>

                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tm theo tn, ST, email, m n..."
                                className="w-full rounded-xl border border-stone-300 px-4 py-2 md:w-80"
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-xl border border-stone-300 px-4 py-2"
                            >
                                <option value="ALL">Tt c trng thi</option>
                                <option value="PENDING">Ch x l</option>
                                <option value="CONFIRMED"> xc nhn</option>
                                <option value="PRINTING">ang in</option>
                                <option value="COMPLETED">Hon thnh</option>
                                <option value="CANCELLED"> hy</option>
                            </select>
                        </div>
                    </div>

                    {loadingOrders ? (
                        <div className="py-10 text-center text-stone-500">ang ti n hng...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-10 text-center text-stone-500">
                            Cha c n hng ph hp.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b text-sm text-stone-500">
                                        <th className="py-3 pr-4">M n</th>
                                        <th className="py-3 pr-4">Khch hng</th>
                                        <th className="py-3 pr-4">Lin h</th>
                                        <th className="py-3 pr-4">Sn phm</th>
                                        <th className="py-3 pr-4">SL</th>
                                        <th className="py-3 pr-4">Tng tin</th>
                                        <th className="py-3 pr-4">Trng thi</th>
                                        <th className="py-3 pr-4">Ngy to</th>
                                        <th className="py-3 pr-4">Thao tc</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b text-sm">
                                            <td className="max-w-[120px] truncate py-4 pr-4 font-mono">
                                                {order.id}
                                            </td>
                                            <td className="py-4 pr-4 font-semibold">
                                                {order.customerName || order.name || ""}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>{order.phone || ""}</div>
                                                <div className="text-xs text-stone-500">{order.email || ""}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>{order.collectionName || ""}</div>
                                                <div className="text-xs text-stone-500">
                                                    {[order.productType, order.productSize].filter(Boolean).join(" / ") ||
                                                        ""}
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">{order.quantity || 1}</td>
                                            <td className="py-4 pr-4 font-semibold">{formatMoney(order.totalAmount ?? order.totalPrice)}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-4 pr-4">{formatDate(order.createdAt)}</td>
                                            <td className="py-4 pr-4">
                                                <button
                                                    onClick={() => openOrderDetail(order.id)}
                                                    className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                                                >
                                                    Xem chi tit
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
                                <h2 className="text-xl font-bold text-stone-900">Chi tit n hng</h2>
                                <p className="mt-1 font-mono text-sm text-stone-500">
                                    {selectedOrder.id}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-xl border px-4 py-2 font-semibold hover:bg-stone-100"
                            >
                                ng
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="py-10 text-center text-stone-500">
                                ang ti chi tit n hng...
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 lg:grid-cols-3">
                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Thng tin khch hng</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <b>H tn:</b>{" "}
                                                {selectedOrder.customerName || selectedOrder.name || ""}
                                            </p>
                                            <p>
                                                <b>ST:</b> {selectedOrder.phone || ""}
                                            </p>
                                            <p>
                                                <b>Email:</b> {selectedOrder.email || ""}
                                            </p>
                                            <p>
                                                <b>a ch:</b> {[selectedOrder.address, selectedOrder.district, selectedOrder.city].filter(Boolean).join(", ") || ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Thng tin photobook</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <b>Collection:</b> {selectedOrder.collectionName || ""}
                                            </p>
                                            <p>
                                                <b>Loi sch:</b> {selectedOrder.productType || ""}
                                            </p>
                                            <p>
                                                <b>Kch thc:</b> {selectedOrder.productSize || ""}
                                            </p>
                                            <p>
                                                <b>S lng:</b> {selectedOrder.quantity || 1}
                                            </p>
                                            <p>
                                                <b>Phng thc TT:</b>{" "}
                                                {selectedOrder.paymentMethod === "DEPOSIT"
                                                    ? "t cc 50%"
                                                    : selectedOrder.paymentMethod === "FULL"
                                                        ? "Thanh ton 100%"
                                                        : selectedOrder.paymentMethod || ""}
                                            </p>
                                            <p>
                                                <b>Tng tin:</b> <span className="font-bold text-emerald-600">{formatMoney(selectedOrder.totalAmount ?? selectedOrder.totalPrice)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border p-5">
                                        <h3 className="mb-4 font-bold">Trng thi x l</h3>
                                        <div className="mb-4">
                                            <StatusBadge status={selectedOrder.status} />
                                        </div>

                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                            className="w-full rounded-xl border border-stone-300 px-4 py-3"
                                        >
                                            <option value="PENDING">Ch x l</option>
                                            <option value="CONFIRMED"> xc nhn</option>
                                            <option value="PRINTING">ang in</option>
                                            <option value="COMPLETED">Hon thnh</option>
                                            <option value="CANCELLED"> hy</option>
                                        </select>
                                    </div>
                                </div>

                                {selectedOrder.note && (
                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <h3 className="mb-3 font-bold flex items-center gap-2 text-amber-800">
                                             Ghi ch ca khch hng
                                        </h3>
                                        <p className="whitespace-pre-wrap text-sm text-amber-900">
                                            {selectedOrder.note}
                                        </p>
                                    </div>
                                )}

                                {/* File PDF thit k */}
                                <div className="mt-6 rounded-2xl border p-5">
                                    <h3 className="mb-3 font-bold flex items-center gap-2">
                                         File PDF thit k
                                    </h3>
                                    {selectedOrder.pdfFileName && selectedOrder.pdfFileData ? (
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-red-500 text-lg font-bold">PDF</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-stone-900 truncate">
                                                        {selectedOrder.pdfFileName}
                                                    </p>
                                                    <p className="text-xs text-green-700 font-medium">
                                                          ti ln  {((selectedOrder.pdfFileData?.length || 0) / 1024).toFixed(0)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const downloadUrl = selectedOrder.pdfFileData?.startsWith('http') 
                                                        ? selectedOrder.pdfFileData 
                                                        : `${API_BASE_URL}${selectedOrder.pdfFileData}`;
                                                    const link = document.createElement('a');
                                                    link.href = downloadUrl;
                                                    link.download = selectedOrder.pdfFileName || 'design.pdf';
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors flex-shrink-0"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Ti xung
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed p-6 text-center text-stone-500">
                                            <p className="text-sm">Khch hng cha ti ln file PDF thit k.</p>
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