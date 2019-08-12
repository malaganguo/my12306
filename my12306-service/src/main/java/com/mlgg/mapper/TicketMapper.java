package com.mlgg.mapper;

import com.mlgg.my12306.param.TicketDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TicketMapper {

    @Select("select * from TICKET where START_STATION = #{startArea} AND END_STATION = #{distArea} ")
    List<TicketDto> checkTicketByStationAndTime(@Param("startArea") String startArea, @Param("distArea") String distArea, @Param("startTime") String startTime);
}
