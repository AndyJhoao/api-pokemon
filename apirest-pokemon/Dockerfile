FROM gradle:8.0.0-jdk17 AS build

WORKDIR /app

COPY gradlew .
COPY gradle/wrapper/gradle-wrapper.jar gradle/wrapper/
COPY gradle/wrapper/gradle-wrapper.properties gradle/wrapper/
COPY build.gradle .
COPY settings.gradle .

RUN apt-get update && \
    apt-get install -y dos2unix && \
    dos2unix gradlew && \
    chmod +x gradlew && \
    sed -i -e 's/\r$//' gradlew

RUN ./gradlew dependencies --no-daemon

COPY src src

RUN ./gradlew build --no-daemon

FROM openjdk:17-jdk-slim
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]