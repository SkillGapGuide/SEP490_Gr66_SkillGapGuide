package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.AddOccupationRequestDTO;
import com.skillgapguide.sgg.Dto.OccupationDTO;
import com.skillgapguide.sgg.Entity.Occupation;
import com.skillgapguide.sgg.Entity.OccupationGroup;
import com.skillgapguide.sgg.Repository.OccupationGroupRepository;
import com.skillgapguide.sgg.Repository.OccupationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OccupationService {
    private final OccupationRepository occupationRepository;
    private final OccupationGroupRepository occupationGroupsRepository;

    public List<OccupationDTO> getAllOccupations() {
        List<Occupation> occupations = occupationRepository.findAll();
        return mapToDTOList(occupations);
    }

    public List<OccupationDTO> getEnabledOccupations() {
        List<Occupation> occupations = occupationRepository.findByStatusIgnoreCase("Enable");
        return mapToDTOList(occupations);
    }

    private List<OccupationDTO> mapToDTOList(List<Occupation> occupations) {
        return occupations.stream().map(o -> {
            OccupationDTO dto = new OccupationDTO();
            dto.setId(o.getId());
            dto.setName(o.getName());
            dto.setStatus(o.getStatus());
            dto.setGroupId(o.getOccupationGroup().getId());
            dto.setGroupName(o.getOccupationGroup().getName());
            return dto;
        }).collect(Collectors.toList());
    }

    public void addOccupation(AddOccupationRequestDTO dto) {
        // Check null
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên ngành nghề không được để trống.");
        }

        // Check status
        if (!dto.getStatus().equalsIgnoreCase("Enable") && !dto.getStatus().equalsIgnoreCase("Disable")) {
            throw new IllegalArgumentException("Trạng thái chỉ được là Enable hoặc Disable");
        }

        // Check trùng tên
        if (occupationRepository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Tên ngành nghề đã tồn tại");
        }

        // Check occupation group tồn tại
        OccupationGroup group = occupationGroupsRepository.findById(dto.getOccupationGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Occupation Group" + dto.getOccupationGroupId()));

        // Save
        Occupation occupation = new Occupation();
        occupation.setName(dto.getName());
        occupation.setStatus(dto.getStatus());
        occupation.setOccupationGroup(group);

        occupationRepository.save(occupation);
    }

    public void updateOccupation(Integer id, AddOccupationRequestDTO dto) {
        // Check null
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên ngành nghề không được để trống.");
        }

        if (dto.getStatus() == null ||
                (!dto.getStatus().equalsIgnoreCase("Enable") && !dto.getStatus().equalsIgnoreCase("Disable"))) {
            throw new IllegalArgumentException("Trạng thái chỉ được là 'Enable' hoặc 'Disable'.");
        }

        // Check tồn tại occupation
        Occupation occupation = occupationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngành nghề với ID: " + id));

        // Check tồn tại occupation group
        OccupationGroup group = occupationGroupsRepository.findById(dto.getOccupationGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Occupation group không tồn tại với ID: " + dto.getOccupationGroupId()));

        // Check duplicate name
        Optional<Occupation> duplicate = occupationRepository.findByNameIgnoreCase(dto.getName().trim());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException("Tên ngành nghề đã tồn tại.");
        }

        // Update
        occupation.setName(dto.getName().trim());
        occupation.setStatus(dto.getStatus().trim());
        occupation.setOccupationGroup(group);

        occupationRepository.save(occupation);
    }

    public boolean toggleOccupationStatus(Integer id) {
        Optional<Occupation> optional = occupationRepository.findById(id);
        if (optional.isPresent()) {
            Occupation occupation = optional.get();
            String currentStatus = occupation.getStatus();

            if (currentStatus == null) {
                throw new IllegalStateException("Status không được để trống.");
            }

            String normalized = currentStatus.trim().toLowerCase();

            if (!normalized.equals("enable") && !normalized.equals("disable")) {
                throw new IllegalStateException("Status hiện tại không hợp lệ: " + currentStatus);
            }

            String newStatus = normalized.equals("enable") ? "Disable" : "Enable";
            occupation.setStatus(newStatus);
            occupationRepository.save(occupation);
            return true;
        }
        return false;
    }

    public List<OccupationDTO> getByGroupId(Integer groupId) {
        List<Occupation> occupations = occupationRepository.findByOccupationGroupId(groupId);
        return occupations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OccupationDTO convertToDTO(Occupation o) {
        return new OccupationDTO(
                o.getId(),
                o.getName(),
                o.getOccupationGroup().getId(),
                o.getOccupationGroup().getName(),
                o.getStatus()
        );
    }




}
