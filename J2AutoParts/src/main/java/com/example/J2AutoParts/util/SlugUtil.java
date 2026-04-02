package com.example.J2AutoParts.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtil {

	private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
	private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

	private SlugUtil() {
	}

	public static String slugify(String input) {
		if (input == null || input.isBlank()) {
			return "item";
		}
		String n = Normalizer.normalize(input.trim(), Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "");
		String noWhitespace = WHITESPACE.matcher(n).replaceAll("-");
		String cleaned = NON_LATIN.matcher(noWhitespace).replaceAll("");
		String lower = cleaned.toLowerCase(Locale.ROOT).replaceAll("-+", "-");
		String trimmed = lower.replaceAll("^-|-$", "");
		return trimmed.isEmpty() ? "item" : trimmed;
	}
}
