import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "./_components/UserActions";

export default function AdminUsersPage() {
    return <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Users</PageHeader>
        <Button>
            <Link href="/admin/users/new">Add User</Link>
        </Button>
    </div>
    <UsersTable/>
    </>
}

async function UsersTable() {
    const users = await db.user.findMany({
        select:{
            id:true,
            email:true,
            orders:{select:{priceInCents:true}},
        },
        orderBy: {createdAt:'desc'},
    })
    if(users.length ===0)
        return <p>No Users Found</p>;

    return (<Table>
        <TableHeader>
            <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-0"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map(user=>(
                <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{}</TableCell>
                    <TableCell>{formatNumber(user.orders.length)}</TableCell>◘
                    <TableCell>{formatCurrency(user.orders.reduce((sum,o)=>o.priceInCents+sum,0)/100)}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical/>
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DeleteDropdownItem id={user.id}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>)
}