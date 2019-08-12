package com.mlgg.service.serviceImpl;

import com.alibaba.dubbo.common.logger.Logger;
import com.alibaba.dubbo.common.logger.LoggerFactory;
import com.alibaba.dubbo.config.annotation.Service;
import com.mlgg.mapper.TicketMapper;
import com.mlgg.my12306.param.TicketDto;
import com.mlgg.my12306.service.CheckTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @author zhang.yifei4
 * @version 1.0
 * @ClassName CheckTicketServiceImpl
 * <p>
 * @Date 2019年8月6日
 * @since v9.0
 */
@Service
@Component
public class CheckTicketServiceImpl implements CheckTicketService {

	private static final Logger logger = LoggerFactory.getLogger(CheckTicketServiceImpl.class);

	/*@Autowired
	private JdbcTemplate jdbcTemplate;*/

	@Autowired
	private TicketMapper ticketMapper;

	//查票
	@Override
	public List<TicketDto> checkTicket(String startArea, String distArea, String startTime) {
		/*//-------------DAO
		String sql = "select * from TICKET where START_STATION = ?";
		RowMapper<TicketDto> rowMapper = new BeanPropertyRowMapper<TicketDto>(TicketDto.class);
		List<TicketDto> ticketDtoResultList = null;
		try {
			ticketDtoResultList = (List<TicketDto>) jdbcTemplate.query(sql, rowMapper,startArea);
		} catch (DataAccessException e) {
			logger.debug("!!!!!!!!!SQL查询出错"+e);
		}
		//-------------DAO结束
		logger.debug("ticketList:"+ticketDtoResultList.toString());*/
		//MyBatis操作数据
        List<TicketDto> ticketDtosList = ticketMapper.checkTicketByStationAndTime(startArea, distArea, startTime);
        return ticketDtosList;
	}
}
