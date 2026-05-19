package com.halilov.online.metrics;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class MetricsDtos {

    public record DashboardMetrics(
        Kpi kpi,
        Map<String, Long> statusCounts,
        List<DailyBucket> dailyRevenue,
        List<TopProduct> topProducts,
        List<LowStockItem> lowStock,
        List<RecentOrder> recentOrders
    ) {}

    public record Kpi(
        long revenueTodayAgorot,
        long revenueLast7Agorot,
        long revenueLast30Agorot,
        long revenueLifetimeAgorot,
        long ordersTodayCount,
        long ordersLifetimeCount,
        long paidOrdersLifetimeCount,
        long aovAgorot
    ) {}

    public record DailyBucket(String date, long revenueAgorot, long orderCount) {}

    public record TopProduct(
        Long productId,
        String nameHe,
        String sku,
        long qtySold,
        long revenueAgorot
    ) {}

    public record LowStockItem(Long id, String nameHe, String sku, int stockQty) {}

    public record RecentOrder(
        String orderNumber,
        String status,
        long totalAgorot,
        Instant createdAt,
        String customerName,
        String city,
        long itemCount
    ) {}
}
