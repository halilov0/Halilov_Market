package com.halilov.online.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AccountService {

    private final UserRepository users;
    private final SavedAddressRepository addresses;

    public AccountService(UserRepository users, SavedAddressRepository addresses) {
        this.users = users;
        this.addresses = addresses;
    }

    @Transactional
    public void updateProfile(String email, AccountDtos.ProfileUpdate req) {
        User u = users.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "no session"));
        u.setFullName(req.fullName().trim());
        u.setPhone(req.phone() == null || req.phone().isBlank() ? null : req.phone().trim());
    }

    @Transactional(readOnly = true)
    public List<AccountDtos.AddressView> listAddresses(String email) {
        User u = requireUser(email);
        return addresses.findByUserIdOrderByIsDefaultDescCreatedAtDesc(u.getId()).stream()
            .map(AccountDtos.AddressView::from)
            .toList();
    }

    @Transactional
    public AccountDtos.AddressView createAddress(String email, AccountDtos.AddressUpsert req) {
        User u = requireUser(email);
        SavedAddress a = new SavedAddress();
        a.setUserId(u.getId());
        apply(a, req);
        // first address auto-becomes default
        if (addresses.countByUserId(u.getId()) == 0) {
            a.setDefault(true);
        } else if (req.isDefault()) {
            clearDefault(u.getId());
        }
        SavedAddress saved = addresses.save(a);
        return AccountDtos.AddressView.from(saved);
    }

    @Transactional
    public AccountDtos.AddressView updateAddress(String email, Long id, AccountDtos.AddressUpsert req) {
        User u = requireUser(email);
        SavedAddress a = addresses.findByIdAndUserId(id, u.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "address not found"));
        apply(a, req);
        if (req.isDefault() && !a.isDefault()) {
            clearDefault(u.getId());
            a.setDefault(true);
        }
        return AccountDtos.AddressView.from(a);
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        User u = requireUser(email);
        SavedAddress a = addresses.findByIdAndUserId(id, u.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "address not found"));
        boolean wasDefault = a.isDefault();
        addresses.delete(a);
        if (wasDefault) {
            // promote oldest remaining to default for convenience
            addresses.findByUserIdOrderByIsDefaultDescCreatedAtDesc(u.getId()).stream()
                .findFirst().ifPresent(next -> next.setDefault(true));
        }
    }

    @Transactional
    public AccountDtos.AddressView setDefault(String email, Long id) {
        User u = requireUser(email);
        SavedAddress a = addresses.findByIdAndUserId(id, u.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "address not found"));
        if (!a.isDefault()) {
            clearDefault(u.getId());
            a.setDefault(true);
        }
        return AccountDtos.AddressView.from(a);
    }

    private void clearDefault(Long userId) {
        addresses.findFirstByUserIdAndIsDefaultTrue(userId).ifPresent(cur -> {
            cur.setDefault(false);
            addresses.saveAndFlush(cur);
        });
    }

    private User requireUser(String email) {
        return users.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "no session"));
    }

    private void apply(SavedAddress a, AccountDtos.AddressUpsert req) {
        a.setLabel(blankToNull(req.label()));
        a.setFullName(req.fullName().trim());
        a.setPhone(req.phone().trim());
        a.setStreet(req.street().trim());
        a.setHouseNo(blankToNull(req.houseNo()));
        a.setApartment(blankToNull(req.apartment()));
        a.setCity(req.city().trim());
        a.setPostalCode(blankToNull(req.postalCode()));
        a.setNotes(blankToNull(req.notes()));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
