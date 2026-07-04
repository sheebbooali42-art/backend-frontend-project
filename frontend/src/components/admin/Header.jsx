'use client'

import { client } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
 
export default function Header() {
const router=useRouter();

     const handleLogout = async () => {
  try {
    const { data } = await client.post("/user/logout");

    toast.success(data.message);

    router.replace("/");
    router.refresh();
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
};

    return (
        <div className='
            w-full
            h-[70px]
            bg-white
            shadow-sm
            border-b
            px-6
            flex
            items-center
            justify-between
            sticky
            top-0
            z-40
        '>

            {/* Left Side */}
            <div>
                <h1 className='text-md text-gray-800'>
                    Admin Dashboard
                </h1>
                <p className='text-sm text-gray-500'>
                    Welcome back 👋
                </p>
            </div>

            {/* Right Side */}
            <div className='flex items-center gap-5'>

                {/* Search */}
                <div className='
                    hidden
                    md:flex
                    items-center
                    gap-2
                    bg-gray-100
                    px-4
                    py-2
                    rounded-xl
                    w-[250px]
                '>
                    <FaSearch className='text-gray-500' />
                    <input
                        type="text"
                        placeholder='Search here...'
                        className='
                            bg-transparent
                            outline-none
                            text-sm
                            w-full
                        '
                    />
                </div>

                {/* Notification */}
                <div className='
                    relative
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    hover:bg-gray-200
                    duration-200
                '>
                    <FaBell className='text-gray-700' />

                    <span className='
                        absolute
                        top-1
                        right-1
                        w-2
                        h-2
                        bg-red-500
                        rounded-full
                    '></span>
                </div>

                {/* Profile */}
                
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-2xl text-gray-600" />
          <span className="text-sm font-medium">Admin</span>
        </div>
                
        <button 
        onClick={handleLogout}
        className="flex items-center gap-1 font-bold cursor-pointer text-black hover:text-black text-sm">
          Logout
        </button>

            </div>
        </div>
    )
}