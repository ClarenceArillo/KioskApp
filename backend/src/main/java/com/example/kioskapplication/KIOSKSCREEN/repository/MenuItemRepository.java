package com.example.kioskapplication.KIOSKSCREEN.repository;

import com.example.kioskapplication.KIOSKSCREEN.model.MenuItem;
import com.example.kioskapplication.KIOSKSCREEN.model.MenuItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem,Integer> {
    List<MenuItem> findByItemCategorySelected(MenuItemCategory category);

    // ✅ For fetching a specific item by its ID
    Optional<MenuItem> findById(Integer id);

    // ✅ Optional helper: fetch by both category and ID (extra safety)
    Optional<MenuItem> findByItemIdAndItemCategorySelected(Integer itemId, MenuItemCategory category);

}
