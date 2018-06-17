package com.frxs.web.areaboss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.resource.ResourceUrlProvider;

/**
 * @author fygu
 * @version $Id: ResourceUrlProviderController.java,v 0.1 2018年05月04日 16:26 $Exp
 */
@ControllerAdvice
public class ResourceUrlProviderController {


    @Autowired
    private ResourceUrlProvider resourceUrlProvider;

    @ModelAttribute("urls")
    public ResourceUrlProvider urls() {
        return this.resourceUrlProvider;
    }

}
