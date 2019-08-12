package com.mlgg.service;

import com.mlgg.mapper.TicketMapper;
import com.mlgg.my12306.param.TicketDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ServiceApplicationTests {
    @Autowired
    TicketMapper ticketMapper;

	@Test
    public void CheckTicket(){
        List<TicketDto> ResultList = ticketMapper.checkTicketByStationAndTime("西安市", "北京市", "");
        for (TicketDto dto: ResultList
             ) {
            System.out.println(dto);
        }
    }

	@Test
	public void contextLoads() {
	}

}
