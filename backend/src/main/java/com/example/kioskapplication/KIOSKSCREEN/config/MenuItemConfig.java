package com.example.kioskapplication.KIOSKSCREEN.config;

import com.example.kioskapplication.KIOSKSCREEN.model.MenuItem;
import com.example.kioskapplication.KIOSKSCREEN.model.MenuItemCategory;
import com.example.kioskapplication.KIOSKSCREEN.repository.MenuItemRepository;
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
                        "Champorado with Tuyo",
                        MenuItemCategory.WHATs_NEW,
                        1,
                        79.0,
                        "Thick, chocolatey champorado paired with crispy tuyo for that sweet and salty combo.",
                        "images/WHATsNEW/Champorado&tuyo.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Champorado with Puto",
                        MenuItemCategory.WHATs_NEW,
                        1,
                        75.0,
                        "Classic Filipino merienda — warm champorado served with soft, fluffy puto.",
                        "images/WHATsNEW/Champorado&puto.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Sisig Rice Bowl",
                        MenuItemCategory.WHATs_NEW,
                        1,
                        99.0,
                        "Sizzling pork sisig served over hot steamed rice, topped with egg.",
                        "images/WHATsNEW/Sisig.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Laing with Rice",
                        MenuItemCategory.WHATs_NEW,
                        1,
                        89.0,
                        "Creamy and spicy Bicolano-style taro leaves cooked in coconut milk, served with rice.",
                        "images/WHATsNEW/Laing.PNG",
                        'M'));

                // === FAMILY MEAL ===
                repo.save(new MenuItem(
                        0,
                        "Barkada Bilao",
                        MenuItemCategory.FAMILY_MEAL,
                        1,
                        399.0,
                        "Pancit Canton, Lumpiang Shanghai, and Puto — perfect for group sharing.",
                        "images/FAMILYMEAL/Barkada bilao.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Handaan Set",
                        MenuItemCategory.FAMILY_MEAL,
                        1,
                        499.0,
                        "A hearty feast with Kare-Kare, Inihaw na Liempo, Rice, and Leche Flan.",
                        "images/FAMILYMEAL/Handaan set.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Fiesta Meal",
                        MenuItemCategory.FAMILY_MEAL,
                        1,
                        549.0,
                        "A full Filipino spread — Chicken Adobo, Sinigang na Baboy, Pancit Palabok, and Halo-Halo.",
                        "images/FAMILYMEAL/Fiesta meal.PNG",
                        'M'));

                // === ALMUSAL ===
                repo.save(new MenuItem(
                        0,
                        "Tapsilog",
                        MenuItemCategory.ALMUSAL,
                        1,
                        89.0,
                        "Classic breakfast combo — beef tapa, garlic rice, and sunny-side-up egg.",
                        "images/ALMUSAL/Tapsilog.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Longsilog",
                        MenuItemCategory.ALMUSAL,
                        1,
                        79.0,
                        "Sweet and garlicky longganisa served with sinangag and itlog.",
                        "images/ALMUSAL/Longsilog.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Tocilog",
                        MenuItemCategory.ALMUSAL,
                        1,
                        79.0,
                        "Tender tocino with garlic rice and egg — a Filipino favorite.",
                        "images/ALMUSAL/Tocilog.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Bangsilog",
                        MenuItemCategory.ALMUSAL,
                        1,
                        89.0,
                        "Fried boneless bangus, garlic rice, and egg for a filling morning meal.",
                        "images/ALMUSAL/Bangsilog.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Champorado + Tuyo/Puto",
                        MenuItemCategory.ALMUSAL,
                        1,
                        79.0,
                        "Hot chocolate porridge served with your choice of crispy tuyo or soft puto.",
                        "images/ALMUSAL/",
                        'M'));

                // === RICE MEAL ===
                repo.save(new MenuItem(
                        0,
                        "Chicken Adobo with Rice", MenuItemCategory.RICE_MEAL,
                        1,
                        89.0,
                        "Savory chicken adobo simmered in soy sauce, vinegar, and garlic, served with rice.",
                        "images/RICEMEAL/Chicken adobo.PNG",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Pork BBQ with Rice",
                        MenuItemCategory.RICE_MEAL,
                        1,
                        85.0,
                        "Grilled pork barbecue skewers glazed with sweet-savory sauce, served with rice.",
                        "images/RICEMEAL/Pork bbq.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Bistek Tagalog with Rice",
                        MenuItemCategory.RICE_MEAL,
                        1,
                        99.0,
                        "Tender beef strips in soy-calamansi sauce topped with onions, served with rice.",
                        "images/RICEMEAL/Bistek.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Inihaw na Liempo with Rice",
                        MenuItemCategory.RICE_MEAL,
                        1,
                        99.0,
                        "Juicy grilled pork belly with smoky flavor, served with rice.",
                        "images/RICEMEAL/Liempo.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Sinigang na Baboy with Rice",
                        MenuItemCategory.RICE_MEAL,
                        1,
                        99.0,
                        "Tangy pork sinigang served with rice — comforting and hearty.",
                        "images/RICEMEAL/Sinigang na baboy with rice.png",
                        'M'));

                // === MERYENDA ===
                repo.save(new MenuItem(
                        0,
                        "Arroz Caldo with Tokwa’t Baboy",
                        MenuItemCategory.MERYENDA,
                        1,
                        85.0,
                        "Warm arroz caldo topped with boiled egg and served with tokwa’t baboy on the side.",
                        "images/MERYENDA/Aroz caldo.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Pancit Palabok",
                        MenuItemCategory.MERYENDA,
                        1,
                        79.0,
                        "Savory noodle dish with rich shrimp sauce, crushed chicharon, and egg.",
                        "images/MERYENDA/Pancit palabok.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Lugaw with Lumpia",
                        MenuItemCategory.MERYENDA,
                        1,
                        69.0,
                        "Classic rice porridge paired with crispy lumpia — simple yet satisfying.",
                        "images/MERYENDA/Lugaw w lumpia.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Puto Bumbong (Seasonal)",
                        MenuItemCategory.MERYENDA,
                        1,
                        65.0,
                        "Traditional purple rice cake topped with butter, sugar, and niyog — available seasonally.",
                        "images/MERYENDA/Puto bumbong.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Turon with Langka",
                        MenuItemCategory.MERYENDA,
                        1,
                        39.0,
                        "Crispy fried banana roll with sweetened jackfruit filling.",
                        "images/MERYENDA/Turon.png",
                        'M'));

                // === PANGHIMAGAS ===
                repo.save(new MenuItem(
                        0,
                        "Halo-Halo Special",
                        MenuItemCategory.PANGHIMAGAS,
                        1,
                        89.0,
                        "Layered shaved ice dessert with milk, sweet beans, fruits, and leche flan topping.",
                        "images/MERYENDA/Halo-halo.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Leche Flan",
                        MenuItemCategory.PANGHIMAGAS,
                        1,
                        59.0,
                        "Smooth and creamy caramel custard made the traditional Filipino way.",
                        "images/MERYENDA/Leche flan.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Buko Pandan Salad",
                        MenuItemCategory.PANGHIMAGAS,
                        1,
                        69.0,
                        "Refreshing dessert made with coconut strips, pandan jelly, and sweet cream.",
                        "images/MERYENDA/Buko pandan salad.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Mais con Yelo",
                        MenuItemCategory.PANGHIMAGAS,
                        1,
                        59.0,
                        "Shaved ice dessert with sweet corn, milk, and sugar — a tropical favorite.",
                        "images/MERYENDA/mais con yelo.png",
                        'M'));

                repo.save(new MenuItem(
                        0,
                        "Kutsinta with Grated Niyog",
                        MenuItemCategory.PANGHIMAGAS,
                        1,
                        39.0,
                        "Soft, chewy brown rice cakes served with freshly grated coconut.",
                        "images/MERYENDA/Kutsinta.png",
                        'M'));
            }
        };
    }
}
