"use client";

import { useMemo, useState } from "react";
import { Eye, Users } from "lucide-react";
import toast from "react-hot-toast";

import DataTable, {
  DataTableColumn,
} from "@/components/ui/DataTable";

import StatusBadge from "@/components/ui/StatusBadge";

import useCustomers from "@/hooks/useCustomers";

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export default function CustomersPage() {
  const { customersQuery } = useCustomers();

  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const customers: Customer[] =
    customersQuery.data || [];

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const name =
        customer.name?.toLowerCase() || "";

      const email =
        customer.email?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query)
      );
    });
  }, [customers, search]);

  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      render: (customer) => (
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 font-semibold text-[#D4AF37]">
            {(customer.name?.charAt(0) || "U").toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="truncate font-semibold text-white">
              {customer.name || "Unknown Customer"}
            </p>

            <p className="truncate text-xs text-gray-500">
              {customer.email || "-"}
            </p>

          </div>

        </div>
      ),
    },

    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (customer) => (
        <span className="text-gray-300">
          {customer.email || "-"}
        </span>
      ),
    },

    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (customer) => (
        <StatusBadge
          status={
            customer.role === "admin"
              ? "active"
              : "active"
          }
        />
      ),
    },

    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (customer) => (
        <span className="text-gray-400">
          {formatDate(customer.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (customer) => (
        <button
          type="button"
          onClick={() =>
            setSelectedCustomer(customer)
          }
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
        >
          <Eye size={15} />
          View
        </button>
      ),
    },
  ];

  if (customersQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

          <p className="mt-4 text-gray-400">
            Loading customers...
          </p>

        </div>
      </div>
    );
  }

  if (customersQuery.isError) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">

        <h2 className="text-xl font-semibold text-red-400">
          Unable to load customers
        </h2>

        <p className="mt-2 text-gray-500">
          Please check your backend connection and try again.
        </p>

        <button
          type="button"
          onClick={() => customersQuery.refetch()}
          className="mt-6 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:scale-105"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <Users
                size={24}
                className="text-[#D4AF37]"
              />
            </div>

            <div>

              <h1 className="text-4xl font-bold text-white">
                Customers
              </h1>

              <p className="mt-1 text-gray-500">
                Manage your MAA Fragora customers
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] px-6 py-4">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Customers
          </p>

          <p className="mt-1 text-2xl font-bold text-[#D4AF37]">
            {customers.length}
          </p>

        </div>

      </div>

      {/* Customers Table */}

      <DataTable
        columns={columns}
        data={filteredCustomers}
        rowKey={(customer) => customer._id}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search customers by name or email..."
        pageSize={10}
        emptyMessage={
          search
            ? "No customers match your search."
            : "No customers found."
        }
      />

      {/* Customer Details */}

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() =>
            setSelectedCustomer(null)
          }
        />
      )}

    </div>
  );
}

/* -------------------------------------------------- */
/* Customer Details */
/* -------------------------------------------------- */

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
}

function CustomerDetails({
  customer,
  onClose,
}: CustomerDetailsProps) {
  const formatDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-xl font-bold text-[#D4AF37]">
              {(customer.name?.charAt(0) || "U").toUpperCase()}
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                {customer.name || "Unknown Customer"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Customer Profile
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-white"
          >
            ×
          </button>

        </div>

        {/* Information */}

        <div className="mt-8 space-y-4">

          <div className="rounded-2xl border border-white/10 bg-[#181818] p-5">

            <p className="text-xs uppercase tracking-wider text-gray-500">
              Email
            </p>

            <p className="mt-2 break-all text-white">
              {customer.email || "-"}
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#181818] p-5">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Role
              </p>

              <div className="mt-3">
                <StatusBadge
                  status="active"
                />
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#181818] p-5">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Joined
              </p>

              <p className="mt-2 text-white">
                {formatDate(customer.createdAt)}
              </p>

            </div>

          </div>

        </div>

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-[#D4AF37] py-3 font-semibold text-black transition hover:scale-[1.02]"
        >
          Close
        </button>

      </div>

    </div>
  );
}