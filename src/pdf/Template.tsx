import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { QuoteData } from "~/app/(main)/quote/server-quote";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  total: {
    textAlign: "right",
    marginTop: 20,
    fontWeight: "bold",
  },
});

const QuotePDF = ({ quote }: { quote: QuoteData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Seller and Customer Info */}
      <View style={styles.header}>
        <View>
          <Text>From: {quote.seller.name}</Text>
          <Text>{quote.seller.address}</Text>
          <Text>{quote.seller.email}</Text>
        </View>
        <View>
          <Text>To: {quote.customer.name}</Text>
          <Text>{quote.customer.address}</Text>
          <Text>{quote.customer.email}</Text>
        </View>
      </View>

      {/* Quote Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Quote #{quote.number}</Text>
        <Text>Date: {new Date(quote.date).toLocaleDateString()}</Text>
        <Text>
          Valid Until: {new Date(quote.validUntil).toLocaleDateString()}
        </Text>
      </View>

      {/* Items Table */}
      <View style={styles.section}>
        <View style={[styles.row, { fontWeight: "bold" }]}>
          <Text style={styles.column}>Item</Text>
          <Text style={styles.column}>Quantity</Text>
          <Text style={styles.column}>Unit Price</Text>
          <Text style={styles.column}>VAT Rate</Text>
          <Text style={styles.column}>Total</Text>
        </View>
        {quote.items.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.column}>{item.name}</Text>
            <Text style={styles.column}>{item.quantity}</Text>
            <Text style={styles.column}>€{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.column}>
              {item.vatRate ? `${item.vatRate.toFixed(2)}%` : "N/A"}
            </Text>
            <Text style={styles.column}>€{item.totalPrice.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.section}>
        <Text style={styles.total}>Subtotal: €{quote.subtotal.toFixed(2)}</Text>
        {
          <Text style={styles.total}>
            VAT Amount: €{quote.vatAmount ? quote.vatAmount.toFixed(2) : "N/A"}
          </Text>
        }
        {quote.total !== null && (
          <Text style={styles.total}>Total: €{quote.total.toFixed(2)}</Text>
        )}
      </View>

      {/* Terms and Notes */}
      {quote.terms && (
        <View style={styles.section}>
          <Text style={styles.title}>Terms</Text>
          <Text>{quote.terms}</Text>
        </View>
      )}
      {quote.notes && (
        <View style={styles.section}>
          <Text style={styles.title}>Notes</Text>
          <Text>{quote.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export const generateQuotePDF = async (quote: QuoteData) => {
  const blob = await pdf(<QuotePDF quote={quote} />).toBlob();
  return blob;
};

export default QuotePDF;
