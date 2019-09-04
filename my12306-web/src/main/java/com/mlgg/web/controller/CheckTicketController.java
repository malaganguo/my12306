package com.mlgg.web.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.mlgg.my12306.param.TicketDto;
import com.mlgg.my12306.service.CheckTicketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author zhang.yifei4
 * @version 1.0
 * @ClassName CheckTicketController
 * <p>
 * @Date 2019/8/6
 * @since v9.0
 */
@RestController
public class CheckTicketController {

	@Reference
	private CheckTicketService checkTicketService;

	@GetMapping(value = "/checkticket")
	public List<TicketDto> checkTicket(@RequestParam("start_area") String startArea, @RequestParam("dist_area") String distArea,
								 @RequestParam("start_time") String startTime){
		List<TicketDto> ticketList = checkTicketService.checkTicket(startArea, distArea, startTime);
		return ticketList;
	}

    @GetMapping(value = "/countticket")
    public int countTicket(@RequestParam("start_area") String startArea, @RequestParam("dist_area") String distArea,
                                       @RequestParam("start_time") String startTime){
        return checkTicketService.countTicket(startArea, distArea, startTime);
    }
}
