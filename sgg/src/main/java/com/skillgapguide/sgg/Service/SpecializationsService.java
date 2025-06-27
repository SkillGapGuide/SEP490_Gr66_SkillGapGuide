package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.SpecializationDTO;
import com.skillgapguide.sgg.Entity.Specializations;
import com.skillgapguide.sgg.Repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecializationsService {

    private final SpecializationRepository specializationsRepository;

    public List<SpecializationDTO> getEnabledSpecializations() {
        Optional<List<Specializations>> optionalList =
                specializationsRepository.findAllByStatusIgnoreCase("Enable");

        return optionalList.orElse(List.of()).stream().map(spec -> {
            return new SpecializationDTO(
                    spec.getId(),
                    spec.getName(),
                    spec.getOccupation().getId(),             // occupationId
                    spec.getOccupation().getName(),           // occupationName
                    spec.getStatus()
            );
        }).collect(Collectors.toList());
    }
}
