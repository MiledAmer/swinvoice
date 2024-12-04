"use client";

import { format } from "date-fns";
import {
  Quote,
  QuoteItem,
  QuoteStatus,
  Seller,
  Customer,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

type QuoteWithRelations = Quote & {
  seller: Seller;
  customer: Customer;
  items: QuoteItem[];
};

export function QuoteDetails({ quote }: { quote: QuoteWithRelations }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote #{quote.number}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted-foreground">Date</dt>
              <dd>{format(quote.date, "PPP")}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Valid Until</dt>
              <dd>{format(quote.validUntil, "PPP")}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Seller</dt>

              <dd>FROM: {quote.seller.name}</dd>
              <dd>{quote.seller.address}</dd>
              <dd>{quote.seller.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Customer</dt>

              <dd>To: {quote.customer.name}</dd>
              <dd>{quote.customer.address}</dd>
              <dd>{quote.customer.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={getStatusVariant(quote.status)}>
                  {quote.status}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quote Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">VAT Rate</TableHead>
                <TableHead className="text-right">SubTotal</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{item.vatRate}%</TableCell>

                  <TableCell className="text-right">
                    $
                    {(item.quantity
                      ? item.quantity * item.unitPrice
                      : 0
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(item.totalPrice ? item.totalPrice : 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <dl className="mt-5 flex flex-col text-end">
            <div>
              <dt className="font-medium text-muted-foreground">Subtotal</dt>
              <dd>${quote.subtotal.toFixed(2)}</dd>
            </div>
            {quote.vatRate !== null && (
              <div>
                <dt className="font-medium text-muted-foreground">VAT Rate</dt>
                <dd>{quote.vatRate}%</dd>
              </div>
            )}
            {quote.vatAmount !== null && (
              <div>
                <dt className="font-medium text-muted-foreground">
                  VAT Amount
                </dt>
                <dd>${quote.vatAmount.toFixed(2)}</dd>
              </div>
            )}
            {quote.total !== null && (
              <div>
                <dt className="font-medium text-muted-foreground">Total</dt>
                <dd>${quote.total.toFixed(2)}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {quote.terms && (
        <Card>
          <CardHeader>
            <CardTitle>Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quote.terms}</p>
          </CardContent>
        </Card>
      )}

      {quote.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quote.notes}</p>
          </CardContent>
        </Card>
      )}

      {quote.comment && (
        <Card>
          <CardHeader>
            <CardTitle>Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quote.comment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getStatusVariant(
  status: QuoteStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACCEPTED":
      return "default";
    case "PENDING":
      return "secondary";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
}
