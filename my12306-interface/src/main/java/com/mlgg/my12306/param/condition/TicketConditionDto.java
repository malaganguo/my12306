package com.mlgg.my12306.param.condition;

import lombok.Data;

/**
 * @author zhang.yifei4
 * @version 1.0
 * @ClassName TicketCondition
 * <p>
 * @Date 2019年8月6日
 * @since v9.0
 */
@Data
public class TicketConditionDto {
	private String start_area;
	private String dist_area;
	private String start_time;
	//private String return_time;
}
