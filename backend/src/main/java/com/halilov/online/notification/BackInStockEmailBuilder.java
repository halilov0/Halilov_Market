package com.halilov.online.notification;

import java.util.Locale;

import com.halilov.online.catalog.Product;

public final class BackInStockEmailBuilder {

    private BackInStockEmailBuilder() {}

    public static String subject(Product p) {
        return "חזר למלאי: " + p.getNameHe() + " - חלילוב אונליין";
    }

    public static String html(Product p, String siteBaseUrl) {
        String linkUrl = (siteBaseUrl == null || siteBaseUrl.isBlank())
            ? ""
            : siteBaseUrl.trim().replaceAll("/+$", "") + "/p/" + p.getSlug();
        String price = String.format(Locale.US, "₪%.2f", p.getPriceAgorot() / 100.0);

        return "<!doctype html><html dir=\"rtl\" lang=\"he\"><body style=\"margin:0;padding:0;background:#f6f6f6;font-family:Arial,sans-serif;color:#0f1014;direction:rtl;text-align:right\">"
            + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" dir=\"rtl\" style=\"background:#f6f6f6;padding:24px 0;direction:rtl\"><tr><td align=\"center\">"
            + "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" dir=\"rtl\" style=\"max-width:600px;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;direction:rtl\">"
            + "<tr><td style=\"background:#0f1014;color:#fff;padding:20px;text-align:center;direction:rtl\"><h1 style=\"margin:0;font-size:22px;direction:rtl\">חלילוב אונליין</h1></td></tr>"
            + "<tr><td style=\"padding:24px;direction:rtl;text-align:right\">"
            + "<h2 style=\"margin:0 0 12px 0;font-size:20px;direction:rtl;text-align:right\">חדשות טובות — חזר למלאי!</h2>"
            + "<p style=\"margin:0 0 16px 0;color:#555;direction:rtl;text-align:right\">המוצר שביקשת לקבל עליו עדכון חזר למלאי:</p>"
            + "<div style=\"background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px;margin:16px 0;direction:rtl;text-align:right\">"
            + "<div style=\"font-size:16px;font-weight:600;margin-bottom:6px\">" + escape(p.getNameHe()) + "</div>"
            + "<div style=\"font-family:monospace;color:#666;font-size:13px\">" + escape(p.getSku()) + "</div>"
            + "<div style=\"font-size:20px;font-weight:700;margin-top:10px\">" + price + "</div>"
            + "</div>"
            + (linkUrl.isEmpty() ? "" :
                "<div style=\"margin-top:20px;text-align:center\">"
                + "<a href=\"" + escape(linkUrl) + "\" style=\"display:inline-block;background:#0f1014;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600\">לרכישה עכשיו</a>"
                + "</div>")
            + "<p style=\"margin-top:24px;font-size:12px;color:#999;text-align:center\">מומלץ למהר — המלאי עלול להיגמר שוב.</p>"
            + "</td></tr></table>"
            + "</td></tr></table></body></html>";
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;");
    }
}
