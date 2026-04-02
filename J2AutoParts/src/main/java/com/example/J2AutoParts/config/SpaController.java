package com.example.J2AutoParts.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

	@GetMapping({"/", "/{path:^(?!api).*}", "/{path:^(?!api).*}/**"})
	public String forwardToIndex() {
		return "forward:/index.html";
	}
}
