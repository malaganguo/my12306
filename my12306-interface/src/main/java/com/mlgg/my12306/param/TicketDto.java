package com.mlgg.my12306.param;

import lombok.Data;

import java.io.Serializable;

/**
 * @author zhang.yifei4
 * @version 1.0
 * @ClassName TicketDto
 * <p>
 * @since v9.0
 */
@Data
public class TicketDto implements Serializable {

	private static final long serialVersionUID = -413531072213877947L;
	private String number;
	private String start_station;
	private String end_station;
	private String start_time;
	private String end_time;
	private String start_pastrecords;
	private String end_pastrecords;
	private String bseat;
	private String fseat;
	private String sseat;
	private String hsleeper;
	private String fsleeper;
	private String msleeper;
	private String hssleeper;
	private String softseat;
	private String hardseat;
	private String noneseat;
	private String otherseat;
}
