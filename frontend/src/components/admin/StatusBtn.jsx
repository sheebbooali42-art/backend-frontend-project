'use client'

import { client } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import React from 'react'
import {
    HiOutlineTrash,
} from "react-icons/hi";
import { toast } from 'sonner';

export default function StatusBtn({ path, status }) {
    const router = useRouter()

    function statusHandler() { client.patch(path).then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    router.refresh()

                }
            }
        ).catch(
            (error) => {
                toast.error(error.response.data.message || 'Internal Server Error')
            }
        )

    }
    return (
        <div
            onClick={statusHandler}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${status
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
                }`}
        >
            <div
                className={`h-2 w-2 rounded-full ${status
                    ? "bg-emerald-500"
                    : "bg-red-500"
                    }`}
            />

            {status
                ? "Active"
                : "Inactive"}
        </div>
    )
}
