package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.*;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.JobCategoryService;
import com.skillgapguide.sgg.Service.OccupationGroupService;
import com.skillgapguide.sgg.Service.OccupationService;
import com.skillgapguide.sgg.Service.SpecializationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.List;

@RestController
@RequestMapping("/api/businessadmin")
@RequiredArgsConstructor
public class BusinessAdminController {
    private final JobCategoryService jobCategoryService;
    private final SpecializationsService specializationsService;
    private final OccupationGroupService occupationGroupService;
    private final OccupationService occupationService;

    @GetMapping("/view-job-category")
    public Response<List<JobCategoryDTO>> findAll() {
        List<JobCategoryDTO> result = jobCategoryService.getAllJobCategories();
        if(result.isEmpty()){
            return new Response<>(EHttpStatus.NO_RESULT_FOUND);
        }
        return new Response<>(EHttpStatus.OK, result);
    }

    @PostMapping("add-job-category")
    public Response<?> addJobCategory(@RequestBody JobCategoryDTO jobCategoryDTO) {
        if (jobCategoryDTO.getName() == null || jobCategoryDTO.getName().trim().isEmpty()) {
            return new Response<>(EHttpStatus.LACK_INFORMATION, "Tên danh mục không được để trống");
        }
        boolean added = jobCategoryService.addJobCategory(jobCategoryDTO);
        if(!added){
            return new Response<>(EHttpStatus.ALREADY_EXISTS, "Job category đã tồn tại", null);
        }
        return new Response<>(EHttpStatus.OK, "Thêm job category thành công", null);
    }

    @PutMapping("/edit-job-category")
    public Response<?> editJobCategory(@RequestBody JobCategoryDTO dto) {
        try {
            jobCategoryService.editJobCategory(dto);
            return new Response<>(EHttpStatus.OK, "Cập nhật danh mục công việc thành công", null);
        } catch (IllegalArgumentException e) {
            return new Response<>(EHttpStatus.NO_RESULT_FOUND, e.getMessage(), null);
        }
    }

    @GetMapping("/view-occupation-groups")
    public Response<List<OccupationGroupDTO>> getAllOccupationGroups() {
        List<OccupationGroupDTO> list = occupationGroupService.getAllOccupationGroups();
        return new Response<>(EHttpStatus.OK, "Lấy danh sách nhóm nghề nghiệp thành công", list);
    }

    @GetMapping("/view-occupation-groups-enable")
    public Response<List<OccupationGroupDTO>> getEnabledOccupationGroups() {
        List<OccupationGroupDTO> list = occupationGroupService.getEnabledOccupationGroups();
        return new Response<>(EHttpStatus.OK, "Lấy danh sách nhóm nghề nghiệp đang hoạt động thành công", list);
    }

    @PostMapping("/add-occupation-groups")
    public Response<?> addOccupationGroup(@RequestBody OccupationGroupDTO dto) {
        try {
            occupationGroupService.addOccupationGroup(dto);
            return new Response<>(EHttpStatus.OK, "Thêm nhóm nghề nghiệp thành công", null);
        } catch (IllegalArgumentException e) {
            return new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @PutMapping("/edit-occupation-groups")
    public ResponseEntity<?> editOccupationGroup(@RequestBody OccupationGroupDTO dto) {
        try {
            occupationGroupService.editOccupationGroup(dto);
            return ResponseEntity.ok(new Response<>(EHttpStatus.OK, "Cập nhật nhóm nghề nghiệp thành công", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null));
        }
    }

    @PutMapping("/disable-occipation-groups/{id}")
    public ResponseEntity<?> toggleOccupationGroupStatus(@PathVariable Integer id) {
        try {
            boolean success = occupationGroupService.toggleOccupationGroupStatus(id);
            if (success) {
                return ResponseEntity.ok("Cập nhật trạng thái thành công");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy Occupation Group với ID: " + id);
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/view-occupations")
    public Response<List<OccupationDTO>> getAllOccupations() {
        return new Response<>(EHttpStatus.OK, "Lấy tất cả ngành nghề thành công", occupationService.getAllOccupations());
    }

    @GetMapping("/view-occupations-enable")
    public Response<List<OccupationDTO>> getEnabledOccupations() {
        return new Response<>(EHttpStatus.OK, "Lấy ngành nghề đang kích hoạt thành công", occupationService.getEnabledOccupations());
    }

    @PostMapping("/add-occupations")
    public Response<?> addOccupation(@RequestBody AddOccupationRequestDTO dto) {
        try {
            occupationService.addOccupation(dto);
            return new Response<>(EHttpStatus.OK, "Thêm ngành nghề thành công", null);
        } catch (IllegalArgumentException e) {
            return new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @PutMapping("/edit-occupations/{id}")
    public Response<?> updateOccupation(@PathVariable Integer id, @RequestBody AddOccupationRequestDTO dto) {
        try {
            occupationService.updateOccupation(id, dto);
            return new Response<>(EHttpStatus.OK, "Cập nhật ngành nghề thành công", null);
        } catch (IllegalArgumentException e) {
            return new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @PutMapping("/disable-occipation/{id}")
    public ResponseEntity<Response<Boolean>> toggleOccupationStatus(@PathVariable Integer id) {
        boolean result = occupationService.toggleOccupationStatus(id);
        if (result) {
            return ResponseEntity.ok(new Response<>(EHttpStatus.OK, "Thay đổi trạng thái thành công", true));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response<>(EHttpStatus.NO_RESULT_FOUND, "Không tìm thấy ngành nghề", false));
        }
    }


    @GetMapping("/view-specializations")
    public Response<List<SpecializationDTO>> getEnabledSpecializations() {
        List<SpecializationDTO> list = specializationsService.getEnabledSpecializations();
        return new Response<>(EHttpStatus.OK, "Lấy danh sách chuyên ngành đang hoạt động thành công", list);
    }


    

}
