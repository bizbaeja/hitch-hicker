package com.codestates.seb006main.controller;

import com.codestates.seb006main.Image.service.ImageService;
import com.codestates.seb006main.auth.PrincipalDetails;
import com.codestates.seb006main.matching.controller.MatchingController;
import com.codestates.seb006main.matching.dto.MatchingDto;
import com.codestates.seb006main.matching.entity.Matching;
import com.codestates.seb006main.matching.service.MatchingService;
import com.codestates.seb006main.members.dto.MemberDto;
import com.codestates.seb006main.members.entity.Member;
import com.codestates.seb006main.posts.dto.PostsDto;
import com.codestates.seb006main.posts.entity.Posts;
import com.codestates.seb006main.util.Period;
import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MatchingController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
public class MatchingControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private MatchingService matchingService;
    @MockBean
    private PrincipalDetails principalDetails;
    @Autowired
    private Gson gson;

    @Test
    public void postMatching() throws Exception {
        //given
        long postId = 1L;

        MatchingDto.Post postDto = MatchingDto.Post.builder()
                .body("?????????")
                .build();
        String content = gson.toJson(postDto);

        MatchingDto.Response responseDto = MatchingDto.Response.builder()
                .matchingId(1L)
                .body("?????????")
                .member(Member.builder().memberId(1L).displayName("?????? ??????").build())
                .posts(Posts.builder().postId(1L).title("????????? ??????").build())
                .matchingStatus(Matching.MatchingStatus.NOT_READ)
                .createdAt(LocalDateTime.now())
                .build();

        //mock
        given(matchingService.createMatching(Mockito.anyLong(), Mockito.any(), Mockito.any(Authentication.class))).willReturn(responseDto);

        //when
        ResultActions actions = mockMvc.perform(
                post("/api/matching/posts/{post-id}", postId)
                        .with(csrf())
                        .with(user(principalDetails))
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content)
        );

        //then
        actions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.matchingId").value(responseDto.getMatchingId()))
                .andExpect(jsonPath("$.postId").value(postId))
                .andDo(document(
                        "post-matching",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("post-id").description("????????? ?????????")
                        ),
                        requestFields(
                                List.of(
                                        fieldWithPath("body").type(JsonFieldType.STRING).description("???????????? ?????? ??????")
                                )
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("matchingId").type(JsonFieldType.NUMBER).description("?????? ?????????"),
                                        fieldWithPath("body").type(JsonFieldType.STRING).description("?????? ??????"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("memberName").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("postId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("postTitle").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("matchingStatus").type(JsonFieldType.STRING).description("?????? ?????? " +
                                                "(NOT_READ: ?????? ?????? / READ: ??????(?????????) / ACCEPTED: ????????? / REFUSED: ?????????)"),
                                        fieldWithPath("createdAt").type(JsonFieldType.STRING).description("????????? ??????")
                                )
                        )
                ));
    }

    @Test
    public void getMatching() throws Exception {
        //given
        long matchingId = 1L;

        MatchingDto.Response responseDto = MatchingDto.Response.builder()
                .matchingId(1L)
                .body("")
                .member(Member.builder().memberId(1L).displayName("?????? ??????").build())
                .posts(Posts.builder().postId(1L).title("????????? ??????").build())
                .matchingStatus(Matching.MatchingStatus.NOT_READ)
                .createdAt(LocalDateTime.now())
                .build();

        //mock
        given(matchingService.readMatching(Mockito.anyLong(), Mockito.any(Authentication.class))).willReturn(responseDto);

        //when
        ResultActions actions = mockMvc.perform(
                get("/api/matching/{matching-id}", matchingId)
                        .with(csrf())
                        .with(user(principalDetails))
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
        );

        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.matchingId").value(matchingId))
                .andDo(document(
                        "get-matching",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("matching-id").description("?????? ?????????")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("matchingId").type(JsonFieldType.NUMBER).description("?????? ?????????"),
                                        fieldWithPath("body").type(JsonFieldType.STRING).description("?????? ??????"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("memberName").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("postId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("postTitle").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("matchingStatus").type(JsonFieldType.STRING).description("?????? ?????? " +
                                                "(NOT_READ: ?????? ?????? / READ: ??????(?????????) / ACCEPTED: ????????? / REFUSED: ?????????)"),
                                        fieldWithPath("createdAt").type(JsonFieldType.STRING).description("????????? ??????")
                                )
                        )
                ));
    }

    @Test
    public void acceptMatching() throws Exception {
        //given
        long matchingId = 1L;

        MatchingDto.Response responseDto = MatchingDto.Response.builder()
                .matchingId(1L)
                .body("")
                .member(Member.builder().memberId(1L).displayName("?????? ??????").build())
                .posts(Posts.builder().postId(1L).title("????????? ??????").build())
                .matchingStatus(Matching.MatchingStatus.ACCEPTED)
                .createdAt(LocalDateTime.now())
                .build();

        //mock
        given(matchingService.acceptMatching(Mockito.anyLong(), Mockito.any(Authentication.class))).willReturn(responseDto);

        //when
        ResultActions actions = mockMvc.perform(
                get("/api/matching/{matching-id}/accept", matchingId)
                        .with(csrf())
                        .with(user(principalDetails))
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
        );

        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.matchingStatus").value("ACCEPTED"))
                .andDo(document("accept-matching",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("matching-id").description("?????? ?????????")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("matchingId").type(JsonFieldType.NUMBER).description("?????? ?????????"),
                                        fieldWithPath("body").type(JsonFieldType.STRING).description("?????? ??????"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("memberName").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("postId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("postTitle").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("matchingStatus").type(JsonFieldType.STRING).description("?????? ?????? " +
                                                "(NOT_READ: ?????? ?????? / READ: ??????(?????????) / ACCEPTED: ????????? / REFUSED: ?????????)"),
                                        fieldWithPath("createdAt").type(JsonFieldType.STRING).description("????????? ??????")
                                )
                        )
                ));
    }

    @Test
    public void refuseMatching() throws Exception {
        //given
        long matchingId = 1L;

        MatchingDto.Response responseDto = MatchingDto.Response.builder()
                .matchingId(1L)
                .body("")
                .member(Member.builder().memberId(1L).displayName("?????? ??????").build())
                .posts(Posts.builder().postId(1L).title("????????? ??????").build())
                .matchingStatus(Matching.MatchingStatus.REFUSED)
                .createdAt(LocalDateTime.now())
                .build();

        //mock
        given(matchingService.refuseMatching(Mockito.anyLong(), Mockito.any(Authentication.class))).willReturn(responseDto);

        //when
        ResultActions actions = mockMvc.perform(
                get("/api/matching/{matching-id}/refuse", matchingId)
                        .with(csrf())
                        .with(user(principalDetails))
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
        );

        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.matchingStatus").value("REFUSED"))
                .andDo(document("refuse-matching",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("matching-id").description("?????? ?????????")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("matchingId").type(JsonFieldType.NUMBER).description("?????? ?????????"),
                                        fieldWithPath("body").type(JsonFieldType.STRING).description("?????? ??????"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("memberName").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("postId").type(JsonFieldType.NUMBER).description("????????? ?????????"),
                                        fieldWithPath("postTitle").type(JsonFieldType.STRING).description("????????? ??????"),
                                        fieldWithPath("matchingStatus").type(JsonFieldType.STRING).description("?????? ?????? " +
                                                "(NOT_READ: ?????? ?????? / READ: ??????(?????????) / ACCEPTED: ????????? / REFUSED: ?????????)"),
                                        fieldWithPath("createdAt").type(JsonFieldType.STRING).description("????????? ??????")
                                )
                        )
                ));
    }

    @Test
    public void deleteMatching() throws Exception {
        //given
        long matchingId = 1L;

        doNothing().when(matchingService).cancelMatching(Mockito.anyLong(), Mockito.any(Authentication.class));

        //when
        ResultActions actions = mockMvc.perform(
                delete("/api/matching/{matching-id}", matchingId)
                        .with(csrf())
                        .with(user(principalDetails))
        );

        //then
        actions
                .andExpect(status().isNoContent())
                .andDo(document("delete-matching",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("matching-id").description("?????? ?????????")
                        )
                ));
    }
}
