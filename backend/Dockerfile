# syntax=docker/dockerfile:1.7

# ---- build ----
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

COPY pom.xml ./
RUN mvn -B -q -e dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package \
 && cp target/market-*.jar /workspace/app.jar

# ---- runtime ----
FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app \
 && apk add --no-cache curl \
 && mkdir -p /app/media && chown -R app:app /app
WORKDIR /app
COPY --from=build /workspace/app.jar /app/app.jar
USER app

EXPOSE 8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"

HEALTHCHECK --interval=15s --timeout=3s --start-period=40s --retries=5 \
  CMD curl -fsS http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
