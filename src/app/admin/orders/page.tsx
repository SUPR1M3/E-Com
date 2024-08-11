import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDropdownItem } from "./_components/OrderActions";

export default function AdminOrdersPage() {
    return <>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Orders</PageHeader>
        <Button>
            <Link href="/admin/orders/new">Add Order</Link>
        </Button>
    </div>
    <OrdersTable/>
    </>
}

async function OrdersTable() {
    const orders = await db.order.findMany({
        select:{
            id:true,
            priceInCents:true,
            product:{select:{name:true}},
            user: {select: {email:true}},
        },
        orderBy: {createdAt:'desc'},
    })
    if(orders.length ===0)
        return <p>No Orders Found</p>;

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead className="w-0"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {orders.map(order=>
                <TableRow key={order.id}>
                    <TableCell>{order.product.name}</TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell>{formatCurrency(order.priceInCents/100)}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical/>
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DeleteDropdownItem id={order.id}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
}