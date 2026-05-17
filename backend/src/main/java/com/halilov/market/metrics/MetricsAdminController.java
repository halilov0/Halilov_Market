package com.halilov.market.metrics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/metrics")
public class MetricsAdminController {

    private final MetricsService metrics;

    public MetricsAdminController(MetricsService metrics) {
        this.metrics = metrics;
    }

    @GetMapping("/dashboard")
    public MetricsDtos.DashboardMetrics dashboard() {
        return metrics.getDashboard();
    }
}
