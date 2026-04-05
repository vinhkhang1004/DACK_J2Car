package com.example.J2AutoParts.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 180)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false, length = 120)
	private String fullName;

	@Column(length = 20)
	private String phone;

	@Column(length = 500)
	private String address;

	@Column(nullable = false)
	@Builder.Default
	private boolean enabled = true;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "user_roles",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "role_id"))
	@Builder.Default
	private Set<Role> roles = new HashSet<>();

	@jakarta.persistence.ElementCollection(fetch = FetchType.EAGER)
	@jakarta.persistence.CollectionTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "address_text", length = 500)
	@Builder.Default
	private List<String> savedAddresses = new ArrayList<>();
}
