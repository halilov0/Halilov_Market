package com.halilov.online.marketing;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public one-click unsubscribe. Hit from the footer of every marketing email.
 * Returns a tiny HTML page so the user gets confirmation in their browser.
 */
@RestController
@RequestMapping("/api/marketing")
public class UnsubscribeController {

    private final MarketingService service;

    public UnsubscribeController(MarketingService service) {
        this.service = service;
    }

    @GetMapping(value = "/unsubscribe", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> unsubscribe(@RequestParam String token) {
        try {
            String email = service.unsubscribe(token);
            return ResponseEntity.ok(page(
                "הוסרת מרשימת התפוצה",
                "הכתובת <strong>" + escape(email) + "</strong> לא תקבל יותר עדכונים שיווקיים."
                + "<br/>אפשר תמיד להירשם בחזרה מתוך החשבון שלך."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(page(
                "הקישור לא תקף",
                "הקישור פג תוקף או כבר נעשה בו שימוש. ניתן לעדכן את ההעדפות בחשבון שלך."
            ));
        }
    }

    private static String page(String title, String body) {
        return """
            <!doctype html><html lang="he" dir="rtl"><head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <title>%s</title>
            <style>
              body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;
                   background:#f7f5f0;color:#1a1a1a;min-height:100vh;
                   display:flex;align-items:center;justify-content:center;padding:24px}
              .card{background:#fff;padding:32px 28px;border-radius:14px;max-width:480px;
                    text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06)}
              h1{margin:0 0 14px;font-size:22px;font-weight:700}
              p{margin:0;color:#555;line-height:1.6;font-size:14.5px}
              .mark{display:inline-flex;align-items:center;justify-content:center;
                    width:42px;height:42px;border-radius:10px;background:#1a1a1a;
                    color:#fff;font-weight:800;margin-bottom:18px}
            </style></head><body>
            <div class="card">
              <div class="mark">ח</div>
              <h1>%s</h1>
              <p>%s</p>
            </div>
            </body></html>
            """.formatted(title, title, body);
    }

    private static String escape(String s) {
        return s == null ? "" : s
            .replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
