package com.example.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class GuestRateLimitFilter extends OncePerRequestFilter {

    private static final int GUEST_MAX_REQUESTS = 10;

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, AtomicInteger> guestCounts = new ConcurrentHashMap<>();

    public GuestRateLimitFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/api/pokemon");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token) && jwtUtil.isGuest(token)) {
                String email = jwtUtil.extractEmail(token);
                AtomicInteger count = guestCounts.computeIfAbsent(email, k -> new AtomicInteger(0));
                if (count.incrementAndGet() > GUEST_MAX_REQUESTS) {
                    response.setStatus(429);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    objectMapper.writeValue(response.getOutputStream(),
                            Map.of("error", "Guest limit reached. Register for unlimited access."));
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
