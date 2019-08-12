package com.mlgg.service.controller;

import com.alibaba.dubbo.common.logger.Logger;
import com.alibaba.dubbo.common.logger.LoggerFactory;
import com.mlgg.my12306.param.TicketDto;
import com.mlgg.service.serviceImpl.CheckTicketServiceImpl;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


/**
 * @author zhang.yifei4
 * @version 1.0
 * @ClassName TestController
 * <p>
 * @Date 2019年8月6日
 * @since v9.0
 */
@RunWith(SpringRunner.class)
@RestController
public class TestController {

	private static final Logger logger = LoggerFactory.getLogger(TestController.class);

	@Autowired
	JdbcTemplate jdbcTemplate;

	@Autowired
	CheckTicketServiceImpl checkTicketService;

	@GetMapping(value = "/test")
	public TicketDto testCheck(){
		System.out.println("******Test");
		String sql = "select * from TICKET where START_STATION = '上海市'";
		RowMapper<TicketDto> rowMapper = new BeanPropertyRowMapper<TicketDto>(TicketDto.class);
		TicketDto ticket = null;
		try {
			ticket = jdbcTemplate.queryForObject(sql, rowMapper);
		} catch (DataAccessException e) {
			logger.debug("数据查询异常:"+e);
		}
		return ticket;
	}

	@GetMapping(value = "/test2")
	public List<TicketDto> testCheck2(){
		List<TicketDto> result = checkTicketService.checkTicket("上海市", "", "");
		logger.debug("#####result:"+result.get(0));
		return result;
	}

}
