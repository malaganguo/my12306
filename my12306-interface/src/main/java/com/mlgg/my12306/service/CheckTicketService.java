package com.mlgg.my12306.service;

import com.mlgg.my12306.param.TicketDto;
import com.mlgg.my12306.param.condition.TicketConditionDto;

import java.util.List;

/**
 * @ClassName SelectTicketService
 * <p>
 * Created on 2019/8/6
 *
 * @author zhang.yifei4
 * @version 1.0
 * @since v9.0
 */
public interface CheckTicketService {

	//查票接口
	public List<TicketDto> checkTicket(String startArea, String distArea, String startTime);
}
