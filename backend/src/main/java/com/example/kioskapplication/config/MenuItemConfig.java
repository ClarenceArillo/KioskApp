package com.example.kioskapplication.config;

import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.model.MenuItemCategory;
import com.example.kioskapplication.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MenuItemConfig {

    @Bean
    CommandLineRunner seedMenu (MenuItemRepository repo) {
        return args -> {
            // Seed initial menu items if needed
            if (repo.count() == 0) {
                repo.save(new MenuItem(
                        0,
                        "Sisig Rice Bowl",
                        MenuItemCategory.RICE_MEAL ,
                        120.0,
                        "Sizzling pork sisig",
                        "SisigPork.jpeg",
                        true,
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Halo-Halo Special",
                        MenuItemCategory.PANGHIMAGAS,
                        90.0,
                        "Classic Filipino dessert",
                        "Halo-Halo.jpeg",
                        true,
                        'M'));
                // Add more items as needed
            }
        };
    }
}
